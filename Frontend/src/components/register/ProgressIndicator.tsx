interface ProgressIndicatorProps {
  step: number;
  totalSteps: number;
  isMobile?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ step, totalSteps, isMobile = false }) => {
  return (
    <div className={`flex space-x-${isMobile ? '2' : '3'} justify-center`}>
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index + 1 <= step ? 'bg-register-green w-8' : 'bg-gray-200 w-2'
          }`}
        />
      ))}
      {!isMobile && (
        <div className="text-right mt-2 absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-full ml-2">
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;