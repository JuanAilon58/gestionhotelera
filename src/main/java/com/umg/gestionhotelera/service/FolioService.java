package com.umg.gestionhotelera.service;

import com.umg.gestionhotelera.dto.CargoDTO;
import com.umg.gestionhotelera.dto.FolioDTO;
import com.umg.gestionhotelera.entity.Cargo;
import com.umg.gestionhotelera.entity.Estancia;
import com.umg.gestionhotelera.entity.Folio;
import com.umg.gestionhotelera.entity.Servicio;
import com.umg.gestionhotelera.repository.CargoRepository;
import com.umg.gestionhotelera.repository.EstanciaRepository;
import com.umg.gestionhotelera.repository.FolioRepository;
import com.umg.gestionhotelera.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FolioService {

    @Autowired
    private FolioRepository folioRepository;

    @Autowired
    private EstanciaRepository estanciaRepository;
    
    @Autowired
    private CargoRepository cargoRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    public List<FolioDTO> findAll() {
        return folioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public FolioDTO findByEstanciaId(Long estanciaId) {
        Folio folio = folioRepository.findByEstanciaId(estanciaId);
        if (folio == null) {
            // Create a new folio if it doesn't exist
            Estancia estancia = estanciaRepository.findById(estanciaId).orElse(null);
            if (estancia != null) {
                folio = new Folio();
                folio.setEstancia(estancia);
                folio.setPagado(false);
                folio.setTotal(0);
                folio = folioRepository.save(folio);
            } else {
                return null;
            }
        }
        return toDTO(folio);
    }

    public CargoDTO addCargo(CargoDTO cargoDTO) {
        Cargo cargo = toEntity(cargoDTO);
        cargo = cargoRepository.save(cargo);
        updateFolioTotal(cargo.getFolio().getId());
        return toDTO(cargo);
    }
    
    public void deleteCargo(Long cargoId) {
        Cargo cargo = cargoRepository.findById(cargoId).orElse(null);
        if (cargo != null) {
            Long folioId = cargo.getFolio().getId();
            cargoRepository.deleteById(cargoId);
            updateFolioTotal(folioId);
        }
    }

    private void updateFolioTotal(Long folioId) {
        Folio folio = folioRepository.findById(folioId).orElse(null);
        if (folio != null) {
            double total = folio.getCargos().stream().mapToDouble(Cargo::getSubtotal).sum();
            folio.setTotal(total);
            folioRepository.save(folio);
        }
    }

    private FolioDTO toDTO(Folio folio) {
        FolioDTO dto = new FolioDTO();
        dto.setId(folio.getId());
        dto.setEstanciaId(folio.getEstancia().getId());
        dto.setPagado(folio.isPagado());
        dto.setTotal(folio.getTotal());
        dto.setCargos(folio.getCargos().stream().map(this::toDTO).collect(Collectors.toList()));
        return dto;
    }

    private CargoDTO toDTO(Cargo cargo) {
        CargoDTO dto = new CargoDTO();
        dto.setId(cargo.getId());
        dto.setFolioId(cargo.getFolio().getId());
        dto.setCantidad(cargo.getCantidad());
        dto.setSubtotal(cargo.getSubtotal());
        dto.setFecha(cargo.getFecha());
        if (cargo.getServicio() != null) {
            dto.setServicioId(cargo.getServicio().getId());
            dto.setServicioNombre(cargo.getServicio().getNombre());
        }
        return dto;
    }

    private Cargo toEntity(CargoDTO dto) {
        Cargo cargo = new Cargo();
        cargo.setId(dto.getId());
        cargo.setCantidad(dto.getCantidad());
        cargo.setSubtotal(dto.getSubtotal());
        cargo.setFecha(dto.getFecha());
        if (dto.getFolioId() != null) {
            Folio folio = folioRepository.findById(dto.getFolioId()).orElse(null);
            cargo.setFolio(folio);
        }
        if (dto.getServicioId() != null) {
            Servicio servicio = servicioRepository.findById(dto.getServicioId()).orElse(null);
            cargo.setServicio(servicio);
        }
        return cargo;
    }
}
