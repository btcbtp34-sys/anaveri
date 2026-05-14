import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import BulkUploadGrid from '../components/BulkUploadGrid'

export default function MaterialBulkUpload({ onSave }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSave = (rows) => {
    const now = new Date().toISOString()
    let baseId = Date.now()

    rows.forEach((row, index) => {
      const newMaterial = {
        id: baseId + index,
        code: row.code,
        name: row.name,
        tipModel: row.tipModel || '',
        ozellik: row.ozellik || '',
        olcu: row.olcu || '',
        marka: row.marka || '',
        malGrubu: row.malGrubu,
        unit: row.unit,
        productionSites: [row.productionSite],
        status: 'Kontrol Ediliyor',
        urunHiyerarsisi: '',
        commodityKod: '',
        depoYeri: '',
        ureticiParcaNo: '',
        seriNo: '',
        valuationClass: 'P001',
        images: [],
        createdBy: user,
        createdAt: now,
        approvalHistory: [
          {
            action: 'submitted',
            comment: 'Onaya gönderildi',
            user: user,
            timestamp: now
          }
        ]
      }
      onSave(newMaterial)
    })

    navigate('/materials')
  }

  return (
    <BulkUploadGrid
      onSave={handleSave}
      onCancel={() => navigate('/materials')}
    />
  )
}
