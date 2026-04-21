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

import com.billflow.backend.models.Gasto;
import com.billflow.backend.repositories.GastoRepository;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "*")
public class GastoController {
    @Autowired
    private GastoRepository gastoRepository;

    @GetMapping
    public List<Gasto> obtenerTodos() {
        return gastoRepository.findAll();
    }

    @PostMapping
    public Gasto crearGasto(@RequestBody Gasto nuevoGasto) {


        if (nuevoGasto.getConcepto() == null || nuevoGasto.getConcepto().isBlank()) {
            throw new IllegalArgumentException("Falta el concepto del nuevo gasto");
        }

        if (nuevoGasto.getImporte() == null || nuevoGasto.getImporte() == 0) {
            throw new IllegalArgumentException("El gasto no puede ser de 0");
        }

        nuevoGasto.setImporte(Math.abs(nuevoGasto.getImporte()));

        // Todo correcto, guardamos
        return gastoRepository.save(nuevoGasto);
    }
    @PutMapping("/{id}")
    public Gasto actualizarGasto(@PathVariable Long id, @RequestBody Gasto gastoActualizada) {
        gastoActualizada.setId(id);
        return gastoRepository.save(gastoActualizada);
    }

    @DeleteMapping("/{id}")
    public void eliminarGasto(@PathVariable Long id) {
        gastoRepository.deleteById(id);
    }
}