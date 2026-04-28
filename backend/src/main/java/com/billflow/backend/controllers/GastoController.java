package com.billflow.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.billflow.backend.dto.GastoDTO;
import com.billflow.backend.models.Gasto;
import com.billflow.backend.repositories.GastoRepository;
import com.billflow.backend.services.GastoService;

@RestController
@RequestMapping("/api/gastos")
public class GastoController {

    @Autowired
    private GastoRepository gastoRepository;

    @Autowired
    private GastoService gastoService; 

    @GetMapping
    public List<Gasto> obtenerTodosLosGastos() {
        return gastoRepository.findAll();
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<GastoDTO> obtenerGastosDelUsuario(@PathVariable Long idUsuario) {
        return gastoService.GetGastosPreparados(idUsuario);
    }

    @PostMapping
    public Gasto crearGasto(@RequestBody Gasto nuevoGasto) {
        return gastoRepository.save(nuevoGasto);
    }

    @DeleteMapping("/{id}")
    public void eliminarGasto(@PathVariable Long id) {
        gastoRepository.deleteById(id);
    }
}