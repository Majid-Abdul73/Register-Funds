interface StepHeaderProps {
  step: number;
}

const StepHeader: React.FC<StepHeaderProps> = ({ step }) => {
  return (
    <>
      {step === 1 && (
        <>
          <h1 className="text-xl md:text-3xl font-bold mb-4">Get the Support Your <br /> School Needs </h1>
          <div className="mb-12 mt-16 hidden md:block">
            <img 
              src="/images/classroom.jpg" 
              alt="Modern Classroom"
              className="rounded-lg w-full h-[240px] object-cover"
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-xl md:text-3xl font-bold mb-4">Get the Support Your <br /> School Needs </h1>
          <div className="mb-12 mt-16 hidden md:block">
            <img 
              src="/images/classroom.jpg" 
              alt="Modern Classroom"
              className="rounded-lg w-full h-[240px] object-cover"
            />
          </div>
        </>
      )}
      
      {step === 3 && (
        <>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Help us understand your <br className="hidden md:block" /> school’s most urgent <br className="hidden md:block" /> needs.</h1>
          <div className="mb-4 hidden md:block">
            <img 
              src="/images/teacher-student.jpg" 
              alt="School Challenges"
              className="rounded-lg w-full h-[240px] object-cover"
            />
          </div>
        </>
      )}
      
      {step === 4 && (
        <>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Verified schools <br className="hidden md:block" /> receive 2x more funding</h1>
          <div className="mb-4 hidden md:block">
            <img 
              src="/images/steam-class.jpg" 
              alt="steam-class"
              className="rounded-lg w-full h-[240px] object-cover"
            />
          </div>
        </>
      )}
      
      {step === 5 && (
        <>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Your final step to start to <br className="hidden md:block" /> receive funding</h1>
          <div className="mb-4 hidden md:block">
            <img 
              src="/images/students-happy.jpg" 
              alt="Account Security"
              className="rounded-lg w-full h-[240px] object-cover"
            />
          </div>
        </>
      )}
    </>
  );
};

export default StepHeader;