package com.billflow.backend.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.billflow.backend.models.Categoria;
import com.billflow.backend.models.Gasto;
import com.billflow.backend.models.Usuario;
import com.billflow.backend.repositories.GastoRepository;
import com.billflow.backend.services.ChatBotService;

@RestController
@RequestMapping("/whatsapp")
public class WhatsAppController {

    private final ChatBotService chatBotService;
    private final GastoRepository gastoRepository;

    public WhatsAppController(ChatBotService chatBotService, GastoRepository gastoRepository) {
        this.chatBotService = chatBotService;
        this.gastoRepository = gastoRepository;
    }

    @PostMapping(value = "/webhook", produces = "application/xml")
    public String recibirMensajeWhatsApp(@RequestParam Map<String, String> datosTwilio) {

        String mensajeUsuario = datosTwilio.getOrDefault("Body", "");
        String telefonoUsuario = datosTwilio.getOrDefault("From", "Desconocido");

        System.out.println("\n[INFO] Mensaje recibido de " + telefonoUsuario + ": " + mensajeUsuario);

        // 1. Obtener el total de gastos para el contexto de la IA
        List<Gasto> todosLosGastos = gastoRepository.findAll();
        double totalGasto = todosLosGastos.stream().mapToDouble(Gasto::getImporte).sum();
        double presupuestoMensual = 1500.0;

        // 2. Procesar el mensaje a través del servicio de IA
        String respuestaIA = chatBotService.pensarRespuesta(mensajeUsuario, totalGasto, presupuestoMensual);

        // 3. Evaluar si la IA generó un comando de inserción de datos
        if (respuestaIA.startsWith("COMANDO_GUARDAR|")) {
            try {
                String[] parametros = respuestaIA.split("\\|");
                String concepto = parametros[1];
                double importe = Double.parseDouble(parametros[2]);

                Gasto nuevoGasto = new Gasto();
                nuevoGasto.setConcepto(concepto);
                nuevoGasto.setImporte(importe);
                nuevoGasto.setFecha(LocalDate.now());
                
                // Asignar categoría por defecto (ID 6 - Otros)
                Categoria categoriaDefecto = new Categoria(); 
                categoriaDefecto.setId(6L);
                nuevoGasto.setCategoria(categoriaDefecto);
                
                // Asignar usuario administrador (ID 1)
                Usuario usuarioAdmin = new Usuario(); 
                usuarioAdmin.setId(1L);
                nuevoGasto.setUsuario(usuarioAdmin);

                gastoRepository.save(nuevoGasto);
                respuestaIA = "Gasto registrado correctamente: " + concepto + " (" + importe + "€).";
            } catch (Exception e) {
                System.err.println("[ERROR] Fallo al guardar el gasto: " + e.getMessage());
                respuestaIA = "Error interno del sistema al intentar procesar el gasto.";
            }
        }

        System.out.println("[INFO] Respuesta generada: " + respuestaIA + "\n");

        return "<Response><Message>" + respuestaIA + "</Message></Response>";
    }
}