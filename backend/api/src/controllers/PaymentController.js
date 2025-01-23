import { container } from "tsyringe";
export const createPayment = async (req, res) => {
    const { commandeId, amount, currency } = req.body;
    const paymentService = container.resolve("IPaymentService");
    try {
        const clientSecret = await paymentService.processPayment(commandeId, amount, currency);
        res.status(200).json({ clientSecret });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const validatePayment = async (req, res) => {
    const { commandeId } = req.body;
    const paymentService = container.resolve("IPaymentService");
    try {
        await paymentService.validatePayment(commandeId);
        res.status(200).json({ message: "Paiement validé avec succès." });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
