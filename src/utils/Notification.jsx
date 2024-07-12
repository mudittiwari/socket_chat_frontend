import { toast } from 'react-hot-toast';

const notifySuccess = (message) => {
    toast.success(message, {
        iconTheme: {
            primary: '#67539f',
            secondary: '#fff',
        },
    });
};

const notifyError = (message) => {
    toast.error(message, {
        iconTheme: {
            primary: '#67539f',
            secondary: '#fff',
        },
    });
};

export { notifySuccess, notifyError };
