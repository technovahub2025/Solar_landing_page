import { memo, useCallback, useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import { formatNumber } from '../utils/solarEngine.js'

const loadImageAsDataUrl = (src, circular = false) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d')

      if (!context) {
        reject(new Error('Canvas context unavailable'))
        return
      }

      if (circular) {
        const size = Math.min(image.naturalWidth, image.naturalHeight)
        canvas.width = size
        canvas.height = size
        context.clearRect(0, 0, size, size)
        context.save()
        context.beginPath()
        context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
        context.closePath()
        context.clip()

        const sourceX = (image.naturalWidth - size) / 2
        const sourceY = (image.naturalHeight - size) / 2
        context.drawImage(image, sourceX, sourceY, size, size, 0, 0, size, size)
        context.restore()
        resolve(canvas.toDataURL('image/png'))
        return
      }

      context.drawImage(image, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    image.onerror = () => reject(new Error('Logo failed to load'))
    image.src = src
  })

const createTextImageAsset = ({
  color = '#2d2722',
  font = '700 46px Arial',
  padding = 10,
  text,
}) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas context unavailable')
  }

  context.font = font
  const metrics = context.measureText(text)
  const width = Math.ceil(metrics.width + padding * 2)
  const height = 64
  canvas.width = width
  canvas.height = height

  context.font = font
  context.fillStyle = color
  context.textBaseline = 'middle'
  context.fillText(text, padding, height / 2)

  return {
    dataUrl: canvas.toDataURL('image/png'),
    height,
    width,
  }
}

const createTextImageDataUrl = (options) => createTextImageAsset(options).dataUrl

function QuotePreview({ downloadRequestId, onDownloadComplete, proposalData }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { customer, results } = proposalData

  const handleDownload = useCallback(async () => {
    if (isDownloading) {
      return
    }

    setIsDownloading(true)

    try {
      const [{ jsPDF }, logoDataUrl] = await Promise.all([import('jspdf'), loadImageAsDataUrl(logo, true)])
      const rupeeSymbolDataUrl = createTextImageDataUrl({ text: '₹' })
      void rupeeSymbolDataUrl

      const formatPdfAmount = (value) =>
        new Intl.NumberFormat('en-IN', {
          maximumFractionDigits: 0,
        }).format(value || 0)

      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 14
      const contentWidth = pageWidth - margin * 2
      const headerHeight = 26
      let cursorY = margin

      const ensureSpace = (heightNeeded) => {
        if (cursorY + heightNeeded <= pageHeight - margin) {
          return
        }

        pdf.addPage()
        cursorY = margin
      }

      const drawSectionTitle = (title) => {
        ensureSpace(12)
        pdf.setFillColor(248, 241, 229)
        pdf.roundedRect(margin, cursorY, contentWidth, 10, 3, 3, 'F')
        pdf.setTextColor(32, 27, 23)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(12)
        pdf.text(title, margin + 4, cursorY + 6.5)
        cursorY += 14
      }

      const drawRows = (rows) => {
        rows.forEach(([label, value]) => {
          const lines = pdf.splitTextToSize(`${label}: ${value || '-'}`, contentWidth - 8)
          ensureSpace(lines.length * 6 + 2)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(10.5)
          pdf.setTextColor(68, 61, 52)
          pdf.text(lines, margin + 2, cursorY)
          cursorY += lines.length * 6.2
        })

        cursorY += 3
      }

      const drawCurrencyInline = (x, baselineY, value, options = {}) => {
        const {
          fontSize = 10,
          textColor = [68, 61, 52],
        } = options
        const amountAsset = createTextImageAsset({
          color: `rgb(${textColor[0]}, ${textColor[1]}, ${textColor[2]})`,
          font: `400 ${Math.round(fontSize * 3.9)}px Arial`,
          padding: 5,
          text: `\u20B9 ${formatPdfAmount(value)}`,
        })
        const assetHeight = fontSize * 0.62
        const assetWidth = (amountAsset.width / amountAsset.height) * assetHeight

        pdf.addImage(amountAsset.dataUrl, 'PNG', x, baselineY - assetHeight * 0.58, assetWidth, assetHeight)
      }

      const drawFinancialRows = (rows) => {
        rows.forEach((row) => {
          ensureSpace(8)
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(10.5)
          pdf.setTextColor(68, 61, 52)
          pdf.text(`${row.label}:`, margin + 2, cursorY)

          if (row.type === 'currency') {
            const labelWidth = pdf.getTextWidth(`${row.label}:`)
            drawCurrencyInline(margin + 4 + labelWidth, cursorY + 0.2, row.value, {
              fontSize: 10,
            })
          } else {
            pdf.text(row.value, margin + 4 + pdf.getTextWidth(`${row.label}:`), cursorY)
          }

          cursorY += 6.2
        })

        cursorY += 3
      }

      const drawSummaryBox = (lines, options = {}) => {
        let {
          fontSize = 10,
          fontStyle = 'normal',
          lineHeight = 4.6,
          maxLines = Number.POSITIVE_INFINITY,
          minHeight = 22,
          paddingY = 9,
          textColor = [45, 39, 34],
        } = options
        let wrapped = lines.flatMap((line) => pdf.splitTextToSize(line, contentWidth - 12))

        while (wrapped.length > maxLines && fontSize > 8.2) {
          fontSize -= 0.3
          lineHeight = Math.max(4, lineHeight - 0.12)
          pdf.setFont('helvetica', fontStyle)
          pdf.setFontSize(fontSize)
          wrapped = lines.flatMap((line) => pdf.splitTextToSize(line, contentWidth - 12))
        }

        const boxHeight = Math.max(minHeight, wrapped.length * lineHeight + paddingY)
        ensureSpace(boxHeight + 5)
        pdf.setDrawColor(233, 190, 113)
        pdf.setFillColor(255, 253, 248)
        pdf.roundedRect(margin, cursorY, contentWidth, boxHeight, 4, 4, 'FD')
        pdf.setFont('helvetica', fontStyle)
        pdf.setFontSize(fontSize)
        pdf.setTextColor(textColor[0], textColor[1], textColor[2])
        pdf.text(wrapped, margin + 4, cursorY + 5.8)
        cursorY += boxHeight + 6
      }

      const drawTable = (headers, rows, columnWidths) => {
        const rowHeight = 9
        const headerRowHeight = 10
        const xPositions = [margin]

        columnWidths.forEach((width, index) => {
          xPositions[index + 1] = xPositions[index] + width
        })

        ensureSpace(headerRowHeight + rowHeight * rows.length + 6)
        pdf.setDrawColor(205, 212, 219)
        pdf.setLineWidth(0.25)

        headers.forEach((header, index) => {
          pdf.setFillColor(238, 229, 203)
          pdf.rect(xPositions[index], cursorY, columnWidths[index], headerRowHeight, 'F')
          pdf.rect(xPositions[index], cursorY, columnWidths[index], headerRowHeight, 'S')
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(10)
          pdf.setTextColor(32, 27, 23)
          pdf.text(header, xPositions[index] + 3, cursorY + 6.5)
        })

        cursorY += headerRowHeight

        rows.forEach((row, rowIndex) => {
          const fillColor = rowIndex % 2 === 0 ? [255, 255, 255] : [250, 247, 240]

          row.forEach((cell, index) => {
            pdf.setFillColor(fillColor[0], fillColor[1], fillColor[2])
            pdf.rect(xPositions[index], cursorY, columnWidths[index], rowHeight, 'F')
            pdf.rect(xPositions[index], cursorY, columnWidths[index], rowHeight, 'S')
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(10)
            pdf.setTextColor(52, 46, 40)

            if (index === row.length - 1 && typeof cell === 'number') {
              drawCurrencyInline(xPositions[index] + 3, cursorY + 6.15, cell, {
                fontSize: 9.8,
                textColor: [52, 46, 40],
              })
            } else {
              pdf.text(String(cell), xPositions[index] + 3, cursorY + 6)
            }
          })

          cursorY += rowHeight
        })

        cursorY += 6
      }

      pdf.setFillColor(255, 255, 255)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      pdf.setFillColor(20, 27, 44)
      pdf.rect(margin, cursorY, contentWidth, headerHeight, 'F')
      pdf.setFillColor(240, 158, 34)
      pdf.rect(margin, cursorY + headerHeight, contentWidth, 1.4, 'F')
      pdf.setFillColor(255, 255, 255)
      pdf.circle(margin + 15, cursorY + 13, 9, 'F')
      pdf.setDrawColor(230, 188, 98)
      pdf.setLineWidth(0.4)
      pdf.circle(margin + 15, cursorY + 13, 9, 'S')
      pdf.addImage(logoDataUrl, 'PNG', margin + 6, cursorY + 4, 18, 18)

      pdf.setTextColor(255, 255, 255)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(17)
      pdf.text('Sunridge Solar - Quotation', margin + 28, cursorY + 14)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10.5)
      pdf.text(`Date: ${proposalData.generatedAt}`, pageWidth - margin - 4, cursorY + 14, { align: 'right' })

      cursorY += headerHeight + 9

      drawSummaryBox([
        `Name: ${customer.name || 'Prospective Customer'}`,
        `Mobile: ${customer.phone || 'Not provided'}`,
        `Email: ${customer.email || 'Not provided'}`,
        `Roof availability: ${customer.roofAvailability || 'Not assessed'}`,
      ], { fontStyle: 'bold', fontSize: 11, lineHeight: 5.6, minHeight: 0, paddingY: 6.5, textColor: [24, 30, 45] })

      drawSectionTitle('System Configuration')
      drawRows([
        ['Recommended size', `${formatNumber(results.systemSizeKw)} kW`],
        ['Panel count', `${formatNumber(results.panelCount, 0)} x 550W modules`],
        ['Inverter', results.inverterSpec],
        ['Battery', results.batterySpec],
        ['Estimated units per month', `${formatNumber(results.monthlyUnits)} units`],
        ['Roof area required', `${formatNumber(results.roofAreaSqm)} sq m`],
      ])

      drawSectionTitle('Cost Breakdown')
      drawTable(
        ['S.No', 'Category', 'Amount'],
        [
          ['1', 'Panels', results.quoteBreakdown.panels],
          ['2', 'Inverter', results.quoteBreakdown.inverter],
          ['3', 'Battery', results.quoteBreakdown.battery],
          ['4', 'Installation', results.quoteBreakdown.installation],
          ['5', 'GST', results.quoteBreakdown.gst],
          ['6', 'Total Estimate', results.quoteBreakdown.total],
        ],
        [16, 100, contentWidth - 116],
      )

      drawSectionTitle('Financial and Environmental Impact')
      drawFinancialRows([
        { label: 'Monthly savings', type: 'currency', value: results.monthlySavings },
        { label: 'Annual savings', type: 'currency', value: results.annualSavings },
        { label: 'Estimated payback', type: 'text', value: `${formatNumber(results.paybackYears, 1)} years` },
        { label: 'Annual CO2 saved', type: 'text', value: `${formatNumber(results.annualCo2Saved)} kg` },
        { label: 'Car km equivalent', type: 'text', value: `${formatNumber(results.carKmEquivalent)} km/year` },
      ])

      drawSummaryBox([
        `Subsidy note: ${results.subsidyNote}`,
        `Customer notes: ${customer.notes || 'No additional notes'}`,
      ], { fontStyle: 'normal', fontSize: 9.4, lineHeight: 4.4, maxLines: 4, textColor: [45, 39, 34] })

      pdf.setTextColor(111, 102, 90)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8.5)
      pdf.text(
        'Approximate proposal. Final pricing and equipment mix may vary after detailed site inspection.',
        margin,
        pageHeight - margin + 1,
      )

      pdf.save(`${proposalData.customer.name || 'solar'}-proposal.pdf`)
      onDownloadComplete?.()
    } finally {
      setIsDownloading(false)
    }
  }, [customer, isDownloading, onDownloadComplete, proposalData, results])

  useEffect(() => {
    if (!downloadRequestId) {
      return undefined
    }

    handleDownload()
  }, [downloadRequestId, handleDownload])

  return null
}

export default memo(QuotePreview)
