<script setup lang="ts">
import GameMessage from "@/components/game/GameMessage.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import { useMainStore } from "@/stores/main";
import { computed, reactive } from "vue";
import axiosInstance from "@/utils/axiosInstance";
import socket from "@/config/socket";

const mainStore = useMainStore();

const state = reactive({
	messages: [],
	otherUser: null,
});

const props = defineProps({
	room: {
		type: Object,
		required: true,
	},
});

state.otherUser = props.room.players.find(
	(user) => user._id !== mainStore.currentUser._id
);

const currentUser = mainStore.currentUser;

const reversedMessages = computed(() => {
	return state.messages.slice().reverse();
});

axiosInstance.get(`/messages/room/${props.room._id}`).then((response) => {
	state.messages = response.data;
});

socket.on("newMessage", (message) => {
	state.messages.push(message);
});

const handleSendMessage = (message) => {
	socket.emit("newMessage", {
		fromUser: currentUser,
		text: message,
		toRoom: props.room._id,
	});
};
</script>

<template>
	<div
		class="messages-container w-72 bg-purple-50 px-4 border-l border-gray-200 flex flex-col py-5"
	>
		<p class="text-gray-800 text-sm font-semibold mb-2">
			{{
				state.otherUser
					? `Discutez avec ${state.otherUser.username}`
					: "En attente de joueur..."
			}}
		</p>
		<div class="chat-messages">
			<GameMessage
				v-for="message in reversedMessages"
				:key="message._id"
				:message="message"
			/>
		</div>
		<ChatInput
			@send-message="handleSendMessage"
			:isGlobalChat="false"
			class="mt-auto"
		/>
	</div>
</template>

<style>
.messages-container {
	height: 100vh;
}
.chat-messages {
	display: flex;
	flex-direction: column-reverse;
	overflow-y: auto;
}
</style>
