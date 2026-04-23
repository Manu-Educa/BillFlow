package com.billflow.backend.controllers;

import com.billflow.backend.dto.EstadoPresupuestoDTO;
import com.billflow.backend.models.Presupuesto;
import com.billflow.backend.repositories.PresupuestoRepository;
import com.billflow.backend.services.PresupuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/presupuestos")
public class PresupuestoController {

    @Autowired
    private PresupuestoRepository presupuestoRepository;

    @Autowired
    private PresupuestoService presupuestoService;

    @GetMapping("/estado/{idUsuario}")
    public ResponseEntity<EstadoPresupuestoDTO> obtenerEstado(@PathVariable Long idUsuario) {
        EstadoPresupuestoDTO datos = presupuestoService.calcularEstado(idUsuario);
        return ResponseEntity.ok(datos);
    }

    // Los métodos básicos que ya tenías
    @GetMapping
    public List<Presupuesto> obtenerTodos() {
        return presupuestoRepository.findAll();
    }

    @PostMapping
    public Presupuesto guardar(@RequestBody Presupuesto presupuesto) {
        return presupuestoRepository.save(presupuesto);
    }
}