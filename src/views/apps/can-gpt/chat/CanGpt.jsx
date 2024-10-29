'use client'

import React, { useState, useEffect, useMemo } from 'react'

import { useTheme } from '@emotion/react'
import { MessageBox } from 'react-chat-elements';

import { useSession } from 'next-auth/react'
import 'react-chat-elements/dist/main.css';

const CanGpt = () => {
	const [messages, setMessages] = useState([]);
	const [userInput, setUserInput] = useState('');

	const handleSendMessage = async () => {
		if (userInput.trim() === '') return;

		// Agrega el mensaje del usuario
		const newMessages = [
			...messages,
			{ position: 'right', type: 'text', text: userInput, date: new Date() }
		];

		setMessages(newMessages);
		setUserInput('');

		// Simula una respuesta del asistente (GPT)
		const response = await fakeGptResponse(userInput);

		// Agrega la respuesta del asistente
		setMessages((prevMessages) => [
			...prevMessages,
			{ position: 'left', type: 'text', text: response, date: new Date() }
		]);
	};

	const fakeGptResponse = async (input) => {
		return new Promise((resolve) =>
			setTimeout(() => resolve(`Hola , ¿en qué puedo ayudarte?`), 1000)
		);
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				height: '100vh',
				padding: '20px',
			}}
		>
			<div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
				{messages.map((message, index) => (
					<MessageBox
						key={index}
						position={message.position}
						type={message.type}
						text={message.text}
						date={message.date}
						styles={{
							color: 'black',
						}}
					/>
				))}
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					padding: '10px 0',
				}}
			>
				<input
					type="text"
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					placeholder="Escribe tu mensaje..."
					style={{
						flex: 1,
						marginRight: '10px',
						padding: '10px',
						borderRadius: '5px',
						border: '1px solid #ccc',
					}}
				/>
				<button
					onClick={handleSendMessage}
					style={{
						padding: '10px 20px',
						borderRadius: '5px',
						backgroundColor: '#4CAF50',
						color: 'white',
						border: 'none',
						cursor: 'pointer',
					}}
				>
					Enviar
				</button>
			</div>
		</div>
	);
};

export default CanGpt;
