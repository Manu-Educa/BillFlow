package com.billflow.backend.controllers;

import com.billflow.backend.dto.GastoDTO;
import com.billflow.backend.models.Gasto;
import com.billflow.backend.repositories.GastoRepository;
import com.billflow.backend.services.GastoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gastos")
public class GastoController {

    @Autowired
    private GastoRepository gastoRepository;

    //Inyecta gastoService
    @Autowired
    private GastoService gastoService; 

    // EndPoint para obtener los gastos de usuario por su ID
    @GetMapping("/usuario/{idUsuario}")
    public List<GastoDTO> obtenerGastosDelUsuario(@PathVariable Long idUsuario) {
        // En lugar de llamar al repositorio, llamamos a tu servicio que los limpia
        return gastoService.GetGastosPreparados(idUsuario);
    }

// Crear un nuevo gasto
    @PostMapping
    public Gasto crearGasto(@RequestBody Gasto nuevoGasto) {
        return gastoRepository.save(nuevoGasto);
    }
// Borrar un gasto por ID
    @DeleteMapping("/{id}")
    public void eliminarGasto(@PathVariable Long id) {
        gastoRepository.deleteById(id);
    }
}