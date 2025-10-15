import Swal from 'sweetalert2';
import '../sweetalert-overlay.css';

interface DeleteConfirmationOptions {
  title?: string;
  text: string;
  confirmButtonText?: string;
  onConfirm: () => void;
  successTitle?: string;
  successText?: string;
}

export const showDeleteConfirmation = ({
  title = 'Are you sure?',
  text,
  confirmButtonText = 'Yes, delete it!',
  onConfirm,
  successTitle = 'Deleted!',
  successText = 'Item has been deleted successfully.'
}: DeleteConfirmationOptions) => {
  const isDark = document.documentElement.classList.contains('dark');
  
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: isDark ? '#4b5563' : '#6b7280',
    confirmButtonText,
    cancelButtonText: 'Cancel',
    background: isDark ? '#1f2937' : '#ffffff',
    color: isDark ? '#f9fafb' : '#111827'
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
      Swal.fire({
        title: successTitle,
        text: successText,
        icon: 'success',
        confirmButtonColor: '#059669',
        background: isDark ? '#1f2937' : '#ffffff',
        color: isDark ? '#f9fafb' : '#111827'
      });
    }
  });
};