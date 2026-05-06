package com.billflow.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.billflow.backend.models.GastoFijo;
import com.billflow.backend.repositories.GastoFijoRepository;

@RestController
@RequestMapping("/api/gastos-fijos")
@CrossOrigin(origins = "*")
public class GastoFijoController {

    @Autowired
    private GastoFijoRepository gastoFijoRepository;

    @GetMapping
    public List<GastoFijo> obtenerTodos() {
        return gastoFijoRepository.findAll();
    }

    @PostMapping
    public GastoFijo crearGastoFijo(@RequestBody GastoFijo nuevoGastoFijo) {
        return gastoFijoRepository.save(nuevoGastoFijo);
    }

    @PutMapping("/{id}")
    public GastoFijo actualizarGastoFijo(@PathVariable Long id, @RequestBody GastoFijo gastoFijoActualizada) {
        gastoFijoActualizada.setId(id);
        return gastoFijoRepository.save(gastoFijoActualizada);
    }

    @DeleteMapping("/{id}")
    public void eliminarGastoFijo(@PathVariable Long id) {
        gastoFijoRepository.deleteById(id);
    }
}