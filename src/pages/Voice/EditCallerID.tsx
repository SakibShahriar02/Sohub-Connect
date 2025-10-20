import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useCallerIds } from '../../hooks/useCallerIds'
import { supabase } from '../../lib/supabase'
import PageMeta from '../../components/common/PageMeta'

export default function EditCallerID() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { updateCallerId } = useCallerIds()
  const [formData, setFormData] = useState({
    name: '',
    caller_id: '',
    channels: 1,
    status: 'Active'
  })
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchCallerID = async () => {
      if (!id) return
      
      try {
        const { data, error } = await supabase
          .from('caller_ids')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        
        if (data) {
          setFormData({
            name: data.name,
            caller_id: data.caller_id,
            channels: data.channels || 1,
            status: data.status
          })
        }
      } catch (error) {
        console.error('Error fetching caller ID:', error)
        alert('Failed to load caller ID data')
        navigate('/voice/caller-ids')
      } finally {
        setDataLoading(false)
      }
    }

    fetchCallerID()
  }, [id, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    
    setLoading(true)
    
    try {
      const result = await updateCallerId(id, formData)
      if (result.success) {
        navigate('/voice/caller-ids')
      } else {
        alert('Failed to update caller ID')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageMeta title="Edit Caller ID | Voice" description="Edit caller ID" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Caller ID</h1>
            <p className="text-gray-600 dark:text-gray-400">Update caller ID information</p>
          </div>
          <button
            onClick={() => navigate('/voice/caller-ids')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
          >
            Back to List
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          {dataLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caller ID *
                </label>
                <input
                  type="tel"
                  value={formData.caller_id}
                  onChange={(e) => setFormData({...formData, caller_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Channels *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.channels}
                  onChange={(e) => setFormData({...formData, channels: parseInt(e.target.value) || 1})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>



            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/voice/caller-ids')}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Caller ID'}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </>
  )
}