'use client'

import React, { useState, useEffect, useMemo } from 'react';

import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, TextField, Button, Paper, Typography, Chip } from '@mui/material';
import { MessageBox, MessageList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

const CanGpt = () => {
	const theme = useTheme();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(true);

	const suggestions = [
		'¿Cómo puedo ayudarte?',
		'Muéstrame las plagas disponibles',
		'Realiza una búsqueda sobre cultivos',
	];

	const handleSendMessage = () => {
		if (input.trim()) {
			setMessages((prev) => [
				...prev,
				{
					position: 'right',
					type: 'text',
					text: input,
					date: new Date(),
				},
			]);
			setInput('');
			setShowSuggestions(false); // Ocultar sugerencias al enviar mensaje
		}
	};

	const handleSuggestionClick = (suggestion) => {
		setInput(suggestion);
		setShowSuggestions(false); // Ocultar sugerencias al seleccionar una
	};

	useEffect(() => {
		// Simulación de respuesta automática del sistema
		if (messages.length > 0 && messages[messages.length - 1].position === 'right') {
			setTimeout(() => {
				setMessages((prev) => [
					...prev,
					{
						position: 'left',
						type: 'text',
						text: 'Hola, ¿en qué puedo ayudarte?',
						date: new Date(),
					},
				]);
			}, 1000);
		}
	}, [messages]);

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				height: '100%',
				padding: '1rem',
				backgroundColor: '#1B1E34', // Fondo similar al mostrado en la imagen
				borderRadius: '12px',
			}}
		>
			{/* Título del Chat */}
			<Typography
				variant="h6"
				align="center"
				sx={{ color: '#FFFFFF', marginBottom: '1rem' }}
			>
				Chat con CANGPT
			</Typography>

			{/* Lista de Mensajes */}
			<Paper
				elevation={3}
				sx={{
					flexGrow: 1,
					overflowY: 'auto',
					backgroundColor: '#2A2D45',
					borderRadius: '12px',
					padding: '1rem',
					marginBottom: '1rem',
				}}
			>
				{showSuggestions ? (
					<Box sx={{ textAlign: 'center' }}>
						<Typography sx={{ color: '#FFFFFF', marginBottom: '1rem' }}>
							¿Qué deseas hacer?
						</Typography>
						{suggestions.map((suggestion, index) => (
							<Chip
								key={index}
								label={suggestion}
								onClick={() => handleSuggestionClick(suggestion)}
								sx={{
									margin: '5px',
									backgroundColor: '#8A56AC',
									color: '#FFFFFF',
									'&:hover': { backgroundColor: '#733D9A' },
								}}
							/>
						))}
					</Box>
				) : (
					<MessageList
						className="message-list"
						lockable={true}
						toBottomHeight={'100%'}
						dataSource={messages}
						style={{ color: 'black' }}
					/>
				)}
			</Paper>

			{/* Input y Botón de Enviar */}
			<Box sx={{ display: 'flex', gap: '8px' }}>
				<TextField
					fullWidth
					variant="outlined"
					size="small"
					placeholder="Escribe un mensaje..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					sx={{
						input: { color: '#FFFFFF' },
						backgroundColor: '#2A2D45',
						borderRadius: '8px',
					}}
				/>
				<Button
					variant="contained"
					sx={{
						backgroundColor: '#8A56AC',
						'&:hover': { backgroundColor: '#733D9A' },
						borderRadius: '8px',
					}}
					onClick={handleSendMessage}
				>
					Enviar
				</Button>
			</Box>
		</Box>
	);
};

export default CanGpt;
