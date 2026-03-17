package com.billflow.backend.controllers;
import com.billflow.backend.models.Presupuesto;
import com.billflow.backend.repositories.PresupuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/presupuestos")
public class PresupuestoController {
    @Autowired private PresupuestoRepository presupuestoRepository;
    @GetMapping public List<Presupuesto> obtenerTodos() { return presupuestoRepository.findAll(); }
    @PostMapping
    public Presupuesto crearPresupuesto(@RequestBody Presupuesto nuevoPresupuesto) {
        return presupuestoRepository.save(nuevoPresupuesto);
    }

    @PutMapping("/{id}")
    public Presupuesto actualizarPresupuesto(@PathVariable Long id, @RequestBody Presupuesto presupuestoActualizado) {
        presupuestoActualizado.setId(id);
        return presupuestoRepository.save(presupuestoActualizado);
    }

    @DeleteMapping("/{id}")
    public void eliminarGrupo(@PathVariable Long id) {
        presupuestoRepository.deleteById(id);
    }
}
