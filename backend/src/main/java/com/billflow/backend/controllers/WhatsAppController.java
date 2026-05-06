package com.billflow.backend.controllers;

import com.billflow.backend.services.ChatBotService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/whatsapp")
public class WhatsAppController {

    private final ChatBotService chatBotService;

    public WhatsAppController(ChatBotService chatBotService) {
        this.chatBotService = chatBotService;
    }

    // produces se usa para que Twilio (WhatsApp) entienda la respuesta en formato XML
    @PostMapping(value = "/webhook", produces = "application/xml")
    public String recibirMensajeWhatsApp(@RequestParam Map<String, String> datosTwilio) {

        // Twilio nos manda el texto en un campo llamado body
        String mensajeUsuario = datosTwilio.getOrDefault("Body", "Hola");
        String telefonoUsuario = datosTwilio.getOrDefault("From", "Desconocido");

        System.out.println("\n💬 RECIBIDO DE " + telefonoUsuario + ": " + mensajeUsuario);

        // Pasamos el mensaje a nuestro servicio de IA
        String respuestaIA = chatBotService.pensarRespuesta(mensajeUsuario);
        System.out.println("BillFlowIA: " + respuestaIA + "\n");

        // Empaquetamos la respuesta en el formato exacto que pide WhatsApp
        return "<Response><Message>" + respuestaIA + "</Message></Response>";
    }
}