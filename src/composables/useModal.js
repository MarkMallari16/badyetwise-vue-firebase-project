
export function useModal(modalName) {
    const showModal = () => {
        const modal = document.getElementById(modalName);

        if (modal) {
            modal.showModal();
        }
    }

    return {
        showModal,
    };
}