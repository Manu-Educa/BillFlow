package com.billflow.backend.services;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

@Service
public class ChatBotService {
    private final ChatModel chatModel;

    public ChatBotService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String pensarRespuesta(String mensajeDelUsuario, double totalGastado, double presupuesto) {
        double restante = presupuesto - totalGastado;
        
        String instrucciones = "Eres el asistente de BillFlow. Contexto actual: Has gastado €" + totalGastado + 
                " de un presupuesto de €" + presupuesto + ". Te quedan €" + restante + " disponibles. " +
                "\n1. Si el usuario quiere REGISTRAR un gasto (ej: 'gasté 10 en café'), responde EXACTAMENTE con este formato: 'COMANDO_GUARDAR|concepto|importe'. " +
                "\n2. Si el usuario PREGUNTA por sus gastos o lo que le queda, respóndele de forma amigable y breve usando el contexto que te di. " +
                "\n3. Para cualquier otra cosa, charla normal. " +
                "\nMensaje del usuario: " + mensajeDelUsuario;

        return chatModel.call(instrucciones);
    }
}