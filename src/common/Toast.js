export const handleFailedConnection = (message, takeHome, toast) => {
    const dismiss = (id) => {
        toast.dismiss(id);
        takeHome ? window.location.href = '/' : console.error(message);
        
    }
    toast.error(
        { 
            approveFunc: (id) => dismiss(id), 
            dismissFunc: (id) => dismiss(id),
            message: message,
            approveTxt:"Cool", 
            dismissTxt:"OK",
            toastId: "failed connection"
        }
    );
}