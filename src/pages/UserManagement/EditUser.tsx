import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useUserManagement } from "../../hooks/useUserManagement";
import { useRoles } from "../../hooks/useRoles";
import Swal from 'sweetalert2';



export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, updateUser } = useUserManagement();
  const { roles } = useRoles();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileno: '',
    address: '',
    profile_picture: '',
    nid_front: '',
    nid_back: '',
    certificate: '',
    role_id: 0,
    status: 'Active' as 'Active' | 'Inactive' | 'Suspended'
  });

  useEffect(() => {
    if (id && users.length > 0) {
      const user = users.find(u => u.id === id);
      if (user) {
        setFormData({
          name: user.name || user.full_name || '',
          email: user.email,
          mobileno: user.mobileno || user.phone || '',
          address: user.address || '',
          profile_picture: user.profile_picture || '',
          nid_front: user.nid_front || '',
          nid_back: user.nid_back || '',
          certificate: user.certificate || '',
          role_id: user.role_id || 0,
          status: user.status
        });
      }
    }
  }, [id, users]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    setLoading(true);
    try {
      await updateUser(id, {
        name: formData.name,
        full_name: formData.name,
        email: formData.email,
        phone: formData.mobileno,
        mobileno: formData.mobileno,
        address: formData.address,
        profile_picture: formData.profile_picture,
        nid_front: formData.nid_front,
        nid_back: formData.nid_back,
        certificate: formData.certificate,
        role_id: formData.role_id,
        status: formData.status
      });
      Swal.fire('Success', 'User updated successfully!', 'success');
      navigate('/user-management/user-list');
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('document', file);

    try {
      const response = await fetch('/upload-document', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: result.filename
        }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  if (!formData.name && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Edit User | User Management" description="Edit user details" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Edit User</h1>
          <Link
            to="/user-management/user-list"
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to List
          </Link>
        </div>
        
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileno"
                  value={formData.mobileno}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role *
                </label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value={0}>Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'profile_picture')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {formData.profile_picture && (
                  <img src={`/uploads/images/${formData.profile_picture}`} alt="Profile" className="mt-2 w-20 h-20 object-cover rounded" />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  NID Front
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'nid_front')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {formData.nid_front && (
                  <div className="mt-2">
                    {formData.nid_front.endsWith('.pdf') ? (
                      <a href={`/uploads/documents/${formData.nid_front}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                    ) : (
                      <img src={`/uploads/images/${formData.nid_front}`} alt="NID Front" className="w-20 h-20 object-cover rounded" />
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  NID Back
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'nid_back')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {formData.nid_back && (
                  <div className="mt-2">
                    {formData.nid_back.endsWith('.pdf') ? (
                      <a href={`/uploads/documents/${formData.nid_back}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                    ) : (
                      <img src={`/uploads/images/${formData.nid_back}`} alt="NID Back" className="w-20 h-20 object-cover rounded" />
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, 'certificate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {formData.certificate && (
                  <div className="mt-2">
                    {formData.certificate.endsWith('.pdf') ? (
                      <a href={`/uploads/documents/${formData.certificate}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                    ) : (
                      <img src={`/uploads/images/${formData.certificate}`} alt="Certificate" className="w-20 h-20 object-cover rounded" />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Link
                to="/user-management/user-list"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}