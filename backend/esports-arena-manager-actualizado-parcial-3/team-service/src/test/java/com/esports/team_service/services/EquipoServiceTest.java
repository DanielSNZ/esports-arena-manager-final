package com.esports.team_service.services;

import com.esports.team_service.clients.UserClient;
import com.esports.team_service.exceptions.EquipoException;
import com.esports.team_service.models.Equipo;
import com.esports.team_service.models.MiembroEquipo;
import com.esports.team_service.models.dtos.EquipoDTO;
import com.esports.team_service.models.dtos.MiembroEquipoDTO;
import com.esports.team_service.models.dtos.UserResponseDTO;
import com.esports.team_service.repositories.EquipoRepository;
import net.datafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EquipoServiceTest {

    @Mock
    private EquipoRepository equipoRepository;

    @Mock
    private UserClient userClient;

    @InjectMocks
    private EquipoServiceImpl equipoService;

    private Equipo equipoPrueba;
    private EquipoDTO equipoDTO;
    private UserResponseDTO capitanActivo;
    private UserResponseDTO capitanInactivo;
    private List<Equipo> equipoList;

    @BeforeEach
    public void setUp() {
        equipoPrueba = new Equipo();
        equipoPrueba.setEquipoId(1L);
        equipoPrueba.setNombre("Team Daniel");
        equipoPrueba.setCapitanId(1L);
        equipoPrueba.setJuegoPrincipalId(1L);
        equipoPrueba.setEstado("ACTIVO");

        MiembroEquipo miembro = new MiembroEquipo();
        miembro.setMiembroId(1L);
        miembro.setUsuarioId(1L);
        miembro.setRolDentroEquipo("CAPITAN");
        miembro.setEquipo(equipoPrueba);
        equipoPrueba.getMiembros().add(miembro);

        MiembroEquipoDTO miembroDTO = new MiembroEquipoDTO();
        miembroDTO.setUsuarioId(1L);
        miembroDTO.setRolDentroEquipo("CAPITAN");

        equipoDTO = new EquipoDTO();
        equipoDTO.setNombre("Team Daniel");
        equipoDTO.setCapitanId(1L);
        equipoDTO.setJuegoPrincipalId(1L);
        equipoDTO.setEstado("ACTIVO");
        equipoDTO.setMiembros(List.of(miembroDTO));

        capitanActivo = new UserResponseDTO();
        capitanActivo.setUsuarioId(1L);
        capitanActivo.setNombre("Daniel");
        capitanActivo.setNickname("danielsaa");
        capitanActivo.setEmail("daniel@gmail.com");
        capitanActivo.setEstado("ACTIVO");

        capitanInactivo = new UserResponseDTO();
        capitanInactivo.setUsuarioId(2L);
        capitanInactivo.setNombre("Usuario Inactivo");
        capitanInactivo.setNickname("inactivo");
        capitanInactivo.setEmail("inactivo@gmail.com");
        capitanInactivo.setEstado("INACTIVO");

        equipoList = new ArrayList<>();
        Faker faker = new Faker(Locale.of("es", "CL"));

        for (int i = 0; i < 100; i++) {
            Equipo equipo = new Equipo();
            equipo.setEquipoId((long) i + 2);
            equipo.setNombre(faker.company().name());
            equipo.setCapitanId(1L);
            equipo.setJuegoPrincipalId(1L);
            equipo.setEstado("ACTIVO");
            equipoList.add(equipo);
        }

        equipoList.add(equipoPrueba);
    }

    @Test
    @DisplayName("Debe listar todos los equipos")
    public void shouldFindAllEquipos() {
        when(equipoRepository.findAll()).thenReturn(equipoList);

        List<Equipo> result = equipoService.findAll();

        assertThat(result).hasSize(101);
        assertThat(result).contains(equipoPrueba);
        verify(equipoRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe buscar equipo por ID")
    public void shouldFindEquipoById() {
        Long id = 1L;
        when(equipoRepository.findById(id)).thenReturn(Optional.of(equipoPrueba));

        Equipo result = equipoService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getEquipoId()).isEqualTo(1L);
        assertThat(result.getNombre()).isEqualTo("Team Daniel");
        verify(equipoRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al buscar equipo inexistente")
    public void shouldNotFindEquipoById() {
        Long id = 999L;
        when(equipoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> equipoService.findById(id))
                .isInstanceOf(EquipoException.class)
                .hasMessage("Equipo no encontrado");

        verify(equipoRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe buscar equipos por juegoPrincipalId")
    public void shouldFindEquiposByJuegoPrincipalId() {
        Long juegoPrincipalId = 1L;
        when(equipoRepository.findByJuegoPrincipalId(juegoPrincipalId)).thenReturn(equipoList);

        List<Equipo> result = equipoService.findByJuegoPrincipalId(juegoPrincipalId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getJuegoPrincipalId()).isEqualTo(juegoPrincipalId);
        verify(equipoRepository, times(1)).findByJuegoPrincipalId(juegoPrincipalId);
    }

    @Test
    @DisplayName("Debe buscar equipos por capitanId")
    public void shouldFindEquiposByCapitanId() {
        Long capitanId = 1L;
        when(equipoRepository.findByCapitanId(capitanId)).thenReturn(equipoList);

        List<Equipo> result = equipoService.findByCapitanId(capitanId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getCapitanId()).isEqualTo(capitanId);
        verify(equipoRepository, times(1)).findByCapitanId(capitanId);
    }

    @Test
    @DisplayName("Debe buscar equipos por estado")
    public void shouldFindEquiposByEstado() {
        String estado = "ACTIVO";
        when(equipoRepository.findByEstado(estado)).thenReturn(equipoList);

        List<Equipo> result = equipoService.findByEstado(estado);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getEstado()).isEqualTo(estado);
        verify(equipoRepository, times(1)).findByEstado(estado);
    }

    @Test
    @DisplayName("Debe guardar equipo si el capitán está activo")
    public void shouldSaveEquipoWhenCaptainIsActive() {
        when(equipoRepository.findByNombre(equipoDTO.getNombre())).thenReturn(Optional.empty());
        when(userClient.findById(equipoDTO.getCapitanId())).thenReturn(capitanActivo);
        when(equipoRepository.save(any(Equipo.class))).thenReturn(equipoPrueba);

        Equipo result = equipoService.save(equipoDTO);

        assertThat(result).isNotNull();
        assertThat(result.getNombre()).isEqualTo("Team Daniel");
        assertThat(result.getEstado()).isEqualTo("ACTIVO");
        verify(equipoRepository, times(1)).findByNombre(equipoDTO.getNombre());
        verify(userClient, times(1)).findById(equipoDTO.getCapitanId());
        verify(equipoRepository, times(1)).save(any(Equipo.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar equipo con nombre repetido")
    public void shouldNotSaveEquipoWhenNameExists() {
        when(equipoRepository.findByNombre(equipoDTO.getNombre())).thenReturn(Optional.of(equipoPrueba));

        assertThatThrownBy(() -> equipoService.save(equipoDTO))
                .isInstanceOf(EquipoException.class)
                .hasMessage("Equipo ya existe");

        verify(equipoRepository, times(1)).findByNombre(equipoDTO.getNombre());
        verify(userClient, never()).findById(anyLong());
        verify(equipoRepository, never()).save(any(Equipo.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar equipo si el capitán no está activo")
    public void shouldNotSaveEquipoWhenCaptainIsInactive() {
        when(equipoRepository.findByNombre(equipoDTO.getNombre())).thenReturn(Optional.empty());
        when(userClient.findById(equipoDTO.getCapitanId())).thenReturn(capitanInactivo);

        assertThatThrownBy(() -> equipoService.save(equipoDTO))
                .isInstanceOf(EquipoException.class)
                .hasMessage("El capitán no está activo");

        verify(equipoRepository, times(1)).findByNombre(equipoDTO.getNombre());
        verify(userClient, times(1)).findById(equipoDTO.getCapitanId());
        verify(equipoRepository, never()).save(any(Equipo.class));
    }

    @Test
    @DisplayName("Debe actualizar equipo existente")
    public void shouldUpdateEquipoById() {
        Long id = 1L;
        MiembroEquipoDTO nuevoMiembro = new MiembroEquipoDTO();
        nuevoMiembro.setUsuarioId(2L);
        nuevoMiembro.setRolDentroEquipo("JUGADOR");

        EquipoDTO cambios = new EquipoDTO();
        cambios.setNombre("Team Actualizado");
        cambios.setCapitanId(2L);
        cambios.setJuegoPrincipalId(2L);
        cambios.setEstado("ACTIVO");
        cambios.setMiembros(List.of(nuevoMiembro));

        when(equipoRepository.findById(id)).thenReturn(Optional.of(equipoPrueba));
        when(equipoRepository.save(any(Equipo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Equipo result = equipoService.updateById(id, cambios);

        assertThat(result.getNombre()).isEqualTo("Team Actualizado");
        assertThat(result.getCapitanId()).isEqualTo(2L);
        assertThat(result.getMiembros()).hasSize(1);
        assertThat(result.getMiembros().get(0).getUsuarioId()).isEqualTo(2L);
        verify(equipoRepository, times(1)).findById(id);
        verify(equipoRepository, times(1)).save(equipoPrueba);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar equipo inexistente")
    public void shouldNotUpdateEquipoWhenNotExists() {
        Long id = 999L;
        when(equipoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> equipoService.updateById(id, equipoDTO))
                .isInstanceOf(EquipoException.class)
                .hasMessage("Equipo no encontrado");

        verify(equipoRepository, times(1)).findById(id);
        verify(equipoRepository, never()).save(any(Equipo.class));
    }

    @Test
    @DisplayName("Debe eliminar equipo existente")
    public void shouldDeleteEquipoById() {
        Long id = 1L;
        when(equipoRepository.existsById(id)).thenReturn(true);

        equipoService.deleteById(id);

        verify(equipoRepository, times(1)).existsById(id);
        verify(equipoRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar equipo inexistente")
    public void shouldNotDeleteEquipoWhenNotExists() {
        Long id = 999L;
        when(equipoRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> equipoService.deleteById(id))
                .isInstanceOf(EquipoException.class)
                .hasMessage("Equipo no encontrado");

        verify(equipoRepository, times(1)).existsById(id);
        verify(equipoRepository, never()).deleteById(id);
    }
}
