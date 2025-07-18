interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

export default function ErrorPopup({ message, onClose }: ErrorPopupProps) {
  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      />

      {/* Popup box */}
      <div className="fixed z-50 bg-red-700 rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 text-white flex flex-col items-center space-y-4">
        <p className="text-center font-semibold text-lg">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
        >
          Close
        </button>
      </div>
    </>
  );
}