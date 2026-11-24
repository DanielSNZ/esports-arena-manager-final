package com.esports.match_service.services;

import com.esports.match_service.clients.TeamClient;
import com.esports.match_service.exceptions.PartidaException;
import com.esports.match_service.models.Partida;
import com.esports.match_service.models.dtos.PartidaDTO;
import com.esports.match_service.models.dtos.TeamResponseDTO;
import com.esports.match_service.repositories.PartidaRepository;
import net.datafaker.Faker;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PartidaServiceTest {

    @Mock
    private PartidaRepository partidaRepository;

    @Mock
    private TeamClient teamClient;

    @InjectMocks
    private PartidaServiceImpl partidaService;

    private Partida partidaPrueba;
    private PartidaDTO partidaDTO;
    private TeamResponseDTO equipoLocalActivo;
    private TeamResponseDTO equipoVisitanteActivo;
    private TeamResponseDTO equipoInactivo;
    private List<Partida> partidaList;

    @BeforeEach
    public void setUp() {
        partidaPrueba = new Partida();
        partidaPrueba.setPartidaId(1L);
        partidaPrueba.setTorneoId(1L);
        partidaPrueba.setEquipoLocalId(1L);
        partidaPrueba.setEquipoVisitanteId(2L);
        partidaPrueba.setFechaPartida(LocalDateTime.of(2026, 6, 20, 18, 0));
        partidaPrueba.setEstado("PROGRAMADA");
        partidaPrueba.setGanadorId(null);

        partidaDTO = new PartidaDTO();
        partidaDTO.setTorneoId(1L);
        partidaDTO.setEquipoLocalId(1L);
        partidaDTO.setEquipoVisitanteId(2L);
        partidaDTO.setFechaPartida(LocalDateTime.of(2026, 6, 20, 18, 0));
        partidaDTO.setEstado("PROGRAMADA");
        partidaDTO.setGanadorId(null);

        equipoLocalActivo = new TeamResponseDTO();
        equipoLocalActivo.setEquipoId(1L);
        equipoLocalActivo.setNombre("Equipo Local");
        equipoLocalActivo.setEstado("ACTIVO");

        equipoVisitanteActivo = new TeamResponseDTO();
        equipoVisitanteActivo.setEquipoId(2L);
        equipoVisitanteActivo.setNombre("Equipo Visitante");
        equipoVisitanteActivo.setEstado("ACTIVO");

        equipoInactivo = new TeamResponseDTO();
        equipoInactivo.setEquipoId(3L);
        equipoInactivo.setNombre("Equipo Inactivo");
        equipoInactivo.setEstado("INACTIVO");

        partidaList = new ArrayList<>();
        Faker faker = new Faker(Locale.of("es", "CL"));

        for (int i = 0; i < 100; i++) {
            Partida partida = new Partida();
            partida.setPartidaId((long) i + 2);
            partida.setTorneoId(1L);
            partida.setEquipoLocalId(1L);
            partida.setEquipoVisitanteId(2L);
            partida.setFechaPartida(LocalDateTime.of(2026, 6, 20, 18, 0).plusDays(i));
            partida.setEstado("PROGRAMADA");
            partida.setGanadorId(null);
            partidaList.add(partida);
        }

        partidaList.add(partidaPrueba);
    }

    @Test
    @DisplayName("Debe listar todas las partidas")
    public void shouldFindAllPartidas() {
        when(partidaRepository.findAll()).thenReturn(partidaList);

        List<Partida> result = partidaService.findAll();

        assertThat(result).hasSize(101);
        assertThat(result).contains(partidaPrueba);
        verify(partidaRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe buscar partida por ID")
    public void shouldFindPartidaById() {
        Long id = 1L;
        when(partidaRepository.findById(id)).thenReturn(Optional.of(partidaPrueba));

        Partida result = partidaService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getPartidaId()).isEqualTo(1L);
        assertThat(result.getEstado()).isEqualTo("PROGRAMADA");
        verify(partidaRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al buscar partida inexistente")
    public void shouldNotFindPartidaById() {
        Long id = 999L;
        when(partidaRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> partidaService.findById(id))
                .isInstanceOf(PartidaException.class)
                .hasMessage("Partida no encontrada");

        verify(partidaRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe buscar partidas por torneoId")
    public void shouldFindPartidasByTorneoId() {
        Long torneoId = 1L;
        when(partidaRepository.findByTorneoId(torneoId)).thenReturn(partidaList);

        List<Partida> result = partidaService.findByTorneoId(torneoId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getTorneoId()).isEqualTo(torneoId);
        verify(partidaRepository, times(1)).findByTorneoId(torneoId);
    }

    @Test
    @DisplayName("Debe buscar partidas por estado")
    public void shouldFindPartidasByEstado() {
        String estado = "PROGRAMADA";
        when(partidaRepository.findByEstado(estado)).thenReturn(partidaList);

        List<Partida> result = partidaService.findByEstado(estado);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getEstado()).isEqualTo(estado);
        verify(partidaRepository, times(1)).findByEstado(estado);
    }

    @Test
    @DisplayName("Debe buscar partidas por ganadorId")
    public void shouldFindPartidasByGanadorId() {
        Long ganadorId = 1L;
        partidaPrueba.setGanadorId(ganadorId);
        when(partidaRepository.findByGanadorId(ganadorId)).thenReturn(partidaList);

        List<Partida> result = partidaService.findByGanadorId(ganadorId);

        assertThat(result).hasSize(101);
        verify(partidaRepository, times(1)).findByGanadorId(ganadorId);
    }

    @Test
    @DisplayName("Debe guardar partida si los equipos están activos")
    public void shouldSavePartidaWhenTeamsAreActive() {
        when(teamClient.findById(partidaDTO.getEquipoLocalId())).thenReturn(equipoLocalActivo);
        when(teamClient.findById(partidaDTO.getEquipoVisitanteId())).thenReturn(equipoVisitanteActivo);
        when(partidaRepository.save(any(Partida.class))).thenReturn(partidaPrueba);

        Partida result = partidaService.save(partidaDTO);

        assertThat(result).isNotNull();
        assertThat(result.getTorneoId()).isEqualTo(1L);
        assertThat(result.getEstado()).isEqualTo("PROGRAMADA");
        verify(teamClient, times(1)).findById(partidaDTO.getEquipoLocalId());
        verify(teamClient, times(1)).findById(partidaDTO.getEquipoVisitanteId());
        verify(partidaRepository, times(1)).save(any(Partida.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar partida si el equipo local no está activo")
    public void shouldNotSavePartidaWhenLocalTeamIsInactive() {
        when(teamClient.findById(partidaDTO.getEquipoLocalId())).thenReturn(equipoInactivo);
        when(teamClient.findById(partidaDTO.getEquipoVisitanteId())).thenReturn(equipoVisitanteActivo);

        assertThatThrownBy(() -> partidaService.save(partidaDTO))
                .isInstanceOf(PartidaException.class)
                .hasMessage("El equipo local no está activo");

        verify(teamClient, times(1)).findById(partidaDTO.getEquipoLocalId());
        verify(teamClient, times(1)).findById(partidaDTO.getEquipoVisitanteId());
        verify(partidaRepository, never()).save(any(Partida.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar partida si el equipo visitante no está activo")
    public void shouldNotSavePartidaWhenVisitorTeamIsInactive() {
        when(teamClient.findById(partidaDTO.getEquipoLocalId())).thenReturn(equipoLocalActivo);
        when(teamClient.findById(partidaDTO.getEquipoVisitanteId())).thenReturn(equipoInactivo);

        assertThatThrownBy(() -> partidaService.save(partidaDTO))
                .isInstanceOf(PartidaException.class)
                .hasMessage("El equipo visitante no está activo");

        verify(teamClient, times(1)).findById(partidaDTO.getEquipoLocalId());
        verify(teamClient, times(1)).findById(partidaDTO.getEquipoVisitanteId());
        verify(partidaRepository, never()).save(any(Partida.class));
    }

    @Test
    @DisplayName("Debe actualizar partida existente")
    public void shouldUpdatePartidaById() {
        Long id = 1L;
        PartidaDTO cambios = new PartidaDTO();
        cambios.setTorneoId(2L);
        cambios.setEquipoLocalId(3L);
        cambios.setEquipoVisitanteId(4L);
        cambios.setFechaPartida(LocalDateTime.of(2026, 7, 1, 20, 0));
        cambios.setEstado("FINALIZADA");
        cambios.setGanadorId(3L);

        when(partidaRepository.findById(id)).thenReturn(Optional.of(partidaPrueba));
        when(partidaRepository.save(any(Partida.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Partida result = partidaService.updateById(id, cambios);

        assertThat(result.getTorneoId()).isEqualTo(2L);
        assertThat(result.getEstado()).isEqualTo("FINALIZADA");
        assertThat(result.getGanadorId()).isEqualTo(3L);
        verify(partidaRepository, times(1)).findById(id);
        verify(partidaRepository, times(1)).save(partidaPrueba);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar partida inexistente")
    public void shouldNotUpdatePartidaWhenNotExists() {
        Long id = 999L;
        when(partidaRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> partidaService.updateById(id, partidaDTO))
                .isInstanceOf(PartidaException.class)
                .hasMessage("Partida no encontrada");

        verify(partidaRepository, times(1)).findById(id);
        verify(partidaRepository, never()).save(any(Partida.class));
    }

    @Test
    @DisplayName("Debe eliminar partida existente")
    public void shouldDeletePartidaById() {
        Long id = 1L;
        when(partidaRepository.existsById(id)).thenReturn(true);

        partidaService.deleteById(id);

        verify(partidaRepository, times(1)).existsById(id);
        verify(partidaRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar partida inexistente")
    public void shouldNotDeletePartidaWhenNotExists() {
        Long id = 999L;
        when(partidaRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> partidaService.deleteById(id))
                .isInstanceOf(PartidaException.class)
                .hasMessage("Partida no encontrada");

        verify(partidaRepository, times(1)).existsById(id);
        verify(partidaRepository, never()).deleteById(id);
    }
}
