package com.billflow.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
@Table(name = "gastos")
public class Gasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String concepto;

    @Column(nullable = false)
    private Double importe;

    @Column(nullable = false)
    private LocalDate fecha;

    private String tiketComprobante;

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    @JsonIgnoreProperties("gastos") // Evita bucle con Categoría
    private Categoria categoria;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties("gastos") // Evita bucle con Usuario
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_grupo")
    @JsonIgnoreProperties("gastos") // Evita bucle con Grupo
    private Grupo grupo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getConcepto() {
        return concepto;
    }

    public void setConcepto(String concepto) {
        this.concepto = concepto;
    }

    public Double getImporte() {
        return importe;
    }

    public void setImporte(Double importe) {
        this.importe = importe;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getTiketComprobante() {
        return tiketComprobante;
    }

    public void setTiketComprobante(String tiketComprobante) {
        this.tiketComprobante = tiketComprobante;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Grupo getGrupo() {
        return grupo;
    }

    public void setGrupo(Grupo grupo) {
        this.grupo = grupo;
    }
}