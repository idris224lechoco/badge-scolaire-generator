import React, { useRef } from 'react'
import QRCode from 'qrcode.react'
import { BadgeData } from '../types'
import '../styles/badge.css'

interface BadgePreviewProps {
  badgeData: BadgeData
}

const BadgePreview: React.FC<BadgePreviewProps> = ({ badgeData }) => {
  const badgeRef = useRef<HTMLDivElement>(null)

  const downloadBadgeAsImage = async () => {
    if (!badgeRef.current) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `badge-${badgeData.studentId || 'student'}.png`
      link.click()
    } catch (error) {
      alert('Erreur lors du téléchargement')
    }
  }

  const downloadBadgeAsPDF = async () => {
    if (!badgeRef.current) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')
      
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: '#ffffff',
        scale: 2
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150]
      })
      
      pdf.addImage(imgData, 'PNG', 5, 5, 90, 140)
      pdf.save(`badge-${badgeData.studentId || 'student'}.pdf`)
    } catch (error) {
      alert('Erreur lors du téléchargement PDF')
    }
  }

  const studentPhotoUrl = badgeData.studentPhoto ? URL.createObjectURL(badgeData.studentPhoto) : null
  const schoolLogoUrl = badgeData.schoolLogo ? URL.createObjectURL(badgeData.schoolLogo) : null

  return (
    <div className="card preview-card">
      <h2>Aperçu du Badge</h2>
      
      <div className="badge-container" ref={badgeRef}>
        <div className="badge-wrapper">
          <div className="badge-header">
            <div className="header-top">
              {badgeData.schoolName}
            </div>
            <div className="header-content">
              <div className="header-left">
                <div className="school-id">{badgeData.studentId}</div>
                <div className="validity">Validité: {badgeData.validity}</div>
              </div>
              {schoolLogoUrl && (
                <div className="header-logo">
                  <img src={schoolLogoUrl} alt="School Logo" />
                </div>
              )}
            </div>
          </div>

          <div className="badge-main">
            <div className="badge-left">
              {studentPhotoUrl ? (
                <div className="student-photo">
                  <img src={studentPhotoUrl} alt={badgeData.studentName} />
                </div>
              ) : (
                <div className="student-photo placeholder">📷</div>
              )}
            </div>

            <div className="badge-right">
              <div className="info-block">
                <div className="label">Nom:</div>
                <div className="value">{badgeData.studentName || 'N/A'}</div>
              </div>
              
              <div className="info-block">
                <div className="label">Matricule:</div>
                <div className="value">{badgeData.studentId || 'N/A'}</div>
              </div>
              
              <div className="info-block">
                <div className="label">Contact:</div>
                <div className="value">{badgeData.phoneNumber || 'N/A'}</div>
              </div>
              
              <div className="info-block">
                <div className="label">Filière:</div>
                <div className="value">{badgeData.field || 'N/A'}</div>
              </div>
              
              <div className="info-block">
                <div className="label">Niveau:</div>
                <div className="value">{badgeData.level || 'N/A'}</div>
              </div>
            </div>
          </div>

          {badgeData.qrCodeValue && (
            <div className="badge-qr">
              <QRCode value={badgeData.qrCodeValue} size={80} />
            </div>
          )}
        </div>
      </div>

      <div className="button-group">
        <button onClick={downloadBadgeAsImage} className="download-btn">
          📥 Télécharger (PNG)
        </button>
        <button onClick={downloadBadgeAsPDF} className="download-btn">
          📄 Télécharger (PDF)
        </button>
      </div>
    </div>
  )
}

export default BadgePreview
