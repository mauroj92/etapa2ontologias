$(document).ready(function() {
  $.get('/obtenerAlumnos', function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].nombre.value);
        $('#tabla_alumnos tbody').append(crearFilaAlumno(data[i].nombre.value));
      }
  });

  $.get('/obtenerEspecializaciones', function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].nombre.value);
        $('#tabla_especial tbody').append(crearFilaEspecial(data[i].id.value, data[i].nombre.value));
      }
  });
});

function crearFilaAlumno(alumno) {
  return $('<tr>').addClass('fila_alumno').append($('<td>').text(alumno));
}

function crearFilaEspecial(id, especial) {
  return $('<tr>').addClass('fila_especial').append($('<td>').attr('id',id).text(especial));
}

function crearFilaCurso(orden, curso) {
  return $('<tr>').addClass('fila_alumno').append($('<td>').text(orden)).append($('<td>').text(curso));
}

function crearFilaCursoAlumno(id, curso) {
  var col_nombre = $('<td>').text(curso);
  var col_cc = $('<td>').append($('<i>').addClass('fas fa-certificate cursado').css('color','orange').hide());
  var col_ca = $('<td>').append($('<i>').addClass('fas fa-certificate aprobado').css('color','green').hide());

  return $('<tr>').attr('id',id).addClass('fila_alumno').append(col_nombre).append(col_cc).append(col_ca);
}


$(document).on('click','#tabla_especial td', function() {
  console.log('El id de la especializacion: ', $(this).attr('id'));

  $.get('/obtenerCostoEspecializacion/' + $(this).attr('id'), function(data) {
      console.log(data[0].costo.value);
      $('#modal_especial .costo_especializacion').text(data[0].costo.value);
  });

  $.get('/obtenerCursosEspecializacion/' + $(this).attr('id'), function(data) {
      console.log(data);
      $('#tabla_cursos tbody tr').remove();

      for (var i = 0; i < data.length; i++) {
        console.log(data[i].nombre.value);
        console.log(data[i].orden.value);
        $('#tabla_cursos tbody').append(crearFilaCurso(data[i].orden.value,data[i].nombre.value));
      }
  });

  $('#modal_especial .modal-title').text($(this).text());
  $('#modal_especial').modal('show');
});

$(document).on('click','#tabla_alumnos td', function() {
  var nombre = $(this).text();

  $.get('/obtenerCursosAlumno/' + $(this).text(), function(data) {
      console.log(data);
      $('#tabla_cursos_alumno tbody tr').remove();

      for (var i = 0; i < data.length; i++) {
        console.log(data[i].nombre_curso.value);
        $('#tabla_cursos_alumno tbody').append(crearFilaCursoAlumno(data[i].id.value, data[i].nombre_curso.value));
      }

      $.get('/obtenerCertificadosCursado/' + nombre, function(data) {
          console.log('Certificados: ', data);
          for (var i = 0; i < data.length; i++) {
            console.log('icono encontrado: ',$('#tabla_cursos_alumno #' + data[i].id.value).find('.cursado'));
            $('#tabla_cursos_alumno #' + data[i].id.value).find('.cursado').show();
          }
      });

      $.get('/obtenerCertificadosAprobado/' + nombre, function(data) {
          console.log('Certificados aprobado: ', data);
          for (var i = 0; i < data.length; i++) {
            $('#tabla_cursos_alumno #' + data[i].id.value).find('.aprobado').show();
          }
      });
  });

  $('#modal_alumno h5.modal-title').text($(this).text());
  $('#modal_alumno').modal('show');
});
