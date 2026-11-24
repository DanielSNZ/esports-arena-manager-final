package com.esports.result_service.services;

import com.esports.result_service.clients.MatchClient;
import com.esports.result_service.exceptions.ResultadoException;
import com.esports.result_service.models.Resultado;
import com.esports.result_service.models.dtos.MatchResponseDTO;
import com.esports.result_service.models.dtos.ResultadoDTO;
import com.esports.result_service.repositories.ResultadoRepository;
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
public class ResultadoServiceTest {

    @Mock
    private ResultadoRepository resultadoRepository;

    @Mock
    private MatchClient matchClient;

    @InjectMocks
    private ResultadoServiceImpl resultadoService;

    private Resultado resultadoPrueba;
    private ResultadoDTO resultadoDTO;
    private MatchResponseDTO partidaFinalizada;
    private MatchResponseDTO partidaProgramada;
    private List<Resultado> resultadoList;

    @BeforeEach
    public void setUp() {
        resultadoPrueba = new Resultado();
        resultadoPrueba.setResultadoId(1L);
        resultadoPrueba.setPartidaId(1L);
        resultadoPrueba.setGanadorId(1L);
        resultadoPrueba.setPuntajeA(16);
        resultadoPrueba.setPuntajeB(10);
        resultadoPrueba.setEstadoValidacion("REGISTRADO");
        resultadoPrueba.setFechaRegistro(LocalDateTime.of(2026, 6, 20, 22, 0));

        resultadoDTO = new ResultadoDTO();
        resultadoDTO.setPartidaId(1L);
        resultadoDTO.setGanadorId(1L);
        resultadoDTO.setPuntajeA(16);
        resultadoDTO.setPuntajeB(10);
        resultadoDTO.setEstadoValidacion("REGISTRADO");
        resultadoDTO.setFechaRegistro(LocalDateTime.of(2026, 6, 20, 22, 0));

        partidaFinalizada = new MatchResponseDTO();
        partidaFinalizada.setPartidaId(1L);
        partidaFinalizada.setEstado("FINALIZADA");
        partidaFinalizada.setGanadorId(1L);

        partidaProgramada = new MatchResponseDTO();
        partidaProgramada.setPartidaId(2L);
        partidaProgramada.setEstado("PROGRAMADA");

        resultadoList = new ArrayList<>();
        Faker faker = new Faker(Locale.of("es", "CL"));

        for (int i = 0; i < 100; i++) {
            Resultado resultado = new Resultado();
            resultado.setResultadoId((long) i + 2);
            resultado.setPartidaId(1L);
            resultado.setGanadorId(1L);
            resultado.setPuntajeA(faker.number().numberBetween(1, 20));
            resultado.setPuntajeB(faker.number().numberBetween(1, 20));
            resultado.setEstadoValidacion("REGISTRADO");
            resultado.setFechaRegistro(LocalDateTime.of(2026, 6, 20, 22, 0));
            resultadoList.add(resultado);
        }

        resultadoList.add(resultadoPrueba);
    }

    @Test
    @DisplayName("Debe listar todos los resultados")
    public void shouldFindAllResultados() {
        when(resultadoRepository.findAll()).thenReturn(resultadoList);

        List<Resultado> result = resultadoService.findAll();

        assertThat(result).hasSize(101);
        assertThat(result).contains(resultadoPrueba);
        verify(resultadoRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe buscar resultado por ID")
    public void shouldFindResultadoById() {
        Long id = 1L;
        when(resultadoRepository.findById(id)).thenReturn(Optional.of(resultadoPrueba));

        Resultado result = resultadoService.findById(id);

        assertThat(result).isNotNull();
        assertThat(result.getResultadoId()).isEqualTo(1L);
        assertThat(result.getEstadoValidacion()).isEqualTo("REGISTRADO");
        verify(resultadoRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al buscar resultado inexistente")
    public void shouldNotFindResultadoById() {
        Long id = 999L;
        when(resultadoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resultadoService.findById(id))
                .isInstanceOf(ResultadoException.class)
                .hasMessage("Resultado no encontrado");

        verify(resultadoRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe buscar resultados por partidaId")
    public void shouldFindResultadosByPartidaId() {
        Long partidaId = 1L;
        when(resultadoRepository.findByPartidaId(partidaId)).thenReturn(resultadoList);

        List<Resultado> result = resultadoService.findByPartidaId(partidaId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getPartidaId()).isEqualTo(partidaId);
        verify(resultadoRepository, times(1)).findByPartidaId(partidaId);
    }

    @Test
    @DisplayName("Debe buscar resultados por ganadorId")
    public void shouldFindResultadosByGanadorId() {
        Long ganadorId = 1L;
        when(resultadoRepository.findByGanadorId(ganadorId)).thenReturn(resultadoList);

        List<Resultado> result = resultadoService.findByGanadorId(ganadorId);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getGanadorId()).isEqualTo(ganadorId);
        verify(resultadoRepository, times(1)).findByGanadorId(ganadorId);
    }

    @Test
    @DisplayName("Debe buscar resultados por estadoValidacion")
    public void shouldFindResultadosByEstadoValidacion() {
        String estadoValidacion = "REGISTRADO";
        when(resultadoRepository.findByEstadoValidacion(estadoValidacion)).thenReturn(resultadoList);

        List<Resultado> result = resultadoService.findByEstadoValidacion(estadoValidacion);

        assertThat(result).hasSize(101);
        assertThat(result.get(0).getEstadoValidacion()).isEqualTo(estadoValidacion);
        verify(resultadoRepository, times(1)).findByEstadoValidacion(estadoValidacion);
    }

    @Test
    @DisplayName("Debe guardar resultado si la partida está finalizada")
    public void shouldSaveResultadoWhenMatchIsFinished() {
        when(matchClient.findById(resultadoDTO.getPartidaId())).thenReturn(partidaFinalizada);
        when(resultadoRepository.save(any(Resultado.class))).thenReturn(resultadoPrueba);

        Resultado result = resultadoService.save(resultadoDTO);

        assertThat(result).isNotNull();
        assertThat(result.getPartidaId()).isEqualTo(1L);
        assertThat(result.getEstadoValidacion()).isEqualTo("REGISTRADO");
        verify(matchClient, times(1)).findById(resultadoDTO.getPartidaId());
        verify(resultadoRepository, times(1)).save(any(Resultado.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción al guardar resultado si la partida no está finalizada")
    public void shouldNotSaveResultadoWhenMatchIsNotFinished() {
        when(matchClient.findById(resultadoDTO.getPartidaId())).thenReturn(partidaProgramada);

        assertThatThrownBy(() -> resultadoService.save(resultadoDTO))
                .isInstanceOf(ResultadoException.class)
                .hasMessage("La partida aún no está finalizada");

        verify(matchClient, times(1)).findById(resultadoDTO.getPartidaId());
        verify(resultadoRepository, never()).save(any(Resultado.class));
    }

    @Test
    @DisplayName("Debe actualizar resultado existente")
    public void shouldUpdateResultadoById() {
        Long id = 1L;
        ResultadoDTO cambios = new ResultadoDTO();
        cambios.setPartidaId(2L);
        cambios.setGanadorId(2L);
        cambios.setPuntajeA(8);
        cambios.setPuntajeB(16);
        cambios.setEstadoValidacion("VALIDADO");
        cambios.setFechaRegistro(LocalDateTime.of(2026, 7, 1, 22, 0));

        when(resultadoRepository.findById(id)).thenReturn(Optional.of(resultadoPrueba));
        when(resultadoRepository.save(any(Resultado.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Resultado result = resultadoService.updateById(id, cambios);

        assertThat(result.getPartidaId()).isEqualTo(2L);
        assertThat(result.getGanadorId()).isEqualTo(2L);
        assertThat(result.getEstadoValidacion()).isEqualTo("VALIDADO");
        verify(resultadoRepository, times(1)).findById(id);
        verify(resultadoRepository, times(1)).save(resultadoPrueba);
    }

    @Test
    @DisplayName("Debe lanzar excepción al actualizar resultado inexistente")
    public void shouldNotUpdateResultadoWhenNotExists() {
        Long id = 999L;
        when(resultadoRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resultadoService.updateById(id, resultadoDTO))
                .isInstanceOf(ResultadoException.class)
                .hasMessage("Resultado no encontrado");

        verify(resultadoRepository, times(1)).findById(id);
        verify(resultadoRepository, never()).save(any(Resultado.class));
    }

    @Test
    @DisplayName("Debe eliminar resultado existente")
    public void shouldDeleteResultadoById() {
        Long id = 1L;
        when(resultadoRepository.existsById(id)).thenReturn(true);

        resultadoService.deleteById(id);

        verify(resultadoRepository, times(1)).existsById(id);
        verify(resultadoRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("Debe lanzar excepción al eliminar resultado inexistente")
    public void shouldNotDeleteResultadoWhenNotExists() {
        Long id = 999L;
        when(resultadoRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> resultadoService.deleteById(id))
                .isInstanceOf(ResultadoException.class)
                .hasMessage("Resultado no encontrado");

        verify(resultadoRepository, times(1)).existsById(id);
        verify(resultadoRepository, never()).deleteById(id);
    }
}
