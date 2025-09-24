export const LoadingSpinner = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col justify-center items-center py-10">       
            <div className="w-12 h-12 border-4 border-[#744f3c] border-t-transparent rounded-full animate-spin"></div>     
            <p className="mt-3 text-gray-700 text-sm animate-pulse">{text}</p>
        </div>
    );
};
