const LoadingSpinner: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center py-20'>
      <div className='animate-spin rounded-full h-16 w-16 border-2 border-gray-300 border-t-black mb-4'></div>
      <span className='text-gray-600 font-light tracking-wide'>ĐANG TẢI...</span>
    </div>
  )
}

export default LoadingSpinner
