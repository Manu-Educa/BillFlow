package com.billflow.backend.services;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

@Service
public class ChatBotService {

    private final ChatModel chatModel;

    // Spring Boot inyecta aquí automáticamente la conexión con OpenAI
    public ChatBotService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String pensarRespuesta(String mensajeDelUsuario) {
        // Instrucciones para la IA
        String instrucciones = "Eres el asistente financiero virtual de la aplicación BillFlow. " +
                "El usuario te va a escribir por WhatsApp. Responde de forma muy breve (1 o 2 líneas como máximo), " +
                "amigable y usando algún emoji. El usuario te dice: " + mensajeDelUsuario;

        // Llamada de OpenAi
        String respuestaIA = chatModel.call(instrucciones);

        // Respuesta de la IA
        return respuestaIA;
    }
}