import Message from "../models/message.js";

export const getChatMessages = async (req, res) => {
	try {
		const messages = await Message.find({
			toRoom: null,
		}).populate(
			"fromUser",
			"username color"
		);
		res.json(messages);
	} catch (err) {
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération des messages.",
		});
	}
};

export const getRoomMessages = async (req, res) => {
	try {
		const messages = await Message.find({
			toRoom: req.params.roomId,
		}).populate(
			"fromUser",
			"username color"
		);
		res.json(messages);
	} catch (err) {
		res.status(500).json({
			message:
				`Une erreur est survenue lors de la récupération des messages : ${err}`
		});
	}
}

export const getMessageById = async (req, res) => {
	try {
		const message = await Message.findById(req.params.messageId);
		if (!message) {
			return res.status(404).json({ message: "Message non trouvé." });
		}
		res.json(message);
	} catch (err) {
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération du message.",
		});
	}
};

export const getMessageByIdWithUserDetails = async (req, res) => {
	try {
		const message = await Message.findById(req.params.messageId).populate(
			"fromUser",
			"firstname lastname picture"
		);
		if (!message) {
			return res.status(404).json({ message: "Message non trouvé." });
		}
		res.json(message);
	} catch (err) {
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la récupération du message.",
		});
	}
};

export const createMessage = async (req, res) => {
	try {
		const { fromUser, toRoom, text } = req.body;
		const newMessage = new Message({
			fromUser,
			toRoom,
			text,
		});
		const savedMessage = await newMessage.save();
		res.status(201).json(savedMessage);
	} catch (err) {
		res.status(500).json({
			message: `Une erreur est survenue lors de l'envoi du message : ${err}`,
		});
	}
};

export const updateMessage = async (req, res) => {
	try {
		const { text } = req.body;

		const updatedMessage = await Message.findByIdAndUpdate(
			req.params.messageId,
			{ text },
			{ new: true }
		);
		if (!updatedMessage) {
			return res.status(404).json({ message: "Message non trouvé." });
		}
		res.json(updatedMessage);
	} catch (err) {
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la mise à jour du message.",
		});
	}
};

export const deleteMessage = async (req, res) => {
	try {
		const deletedMessage = await Message.findByIdAndRemove(
			req.params.messageId
		);
		if (!deletedMessage) {
			return res.status(404).json({ message: "Message non trouvé." });
		}
		res.json({ message: "Message supprimé avec succès." });
	} catch (err) {
		res.status(500).json({
			message:
				"Une erreur est survenue lors de la suppression du message.",
		});
	}
};
