const { Connection, query } = require('stardog');

const conn = new Connection({
  username: 'admin',
  password: 'admin',
  endpoint: 'http://localhost:5820',
});

const express = require('express');
const app = express();

const db = 'TP-DESIBO-2018';

app.use(express.static(__dirname));

app.get('/obtenerAlumnos', (req, res) => {
    query.execute(conn, db, 'select ?nombre where { ?a a ex:Alumno. ?a ex:alumno_tiene_nombre ?nombre }', 'application/sparql-results+json', {
        limit: 10,
        offset: 0,
    }).then(({ body }) => {
      console.log(body.results.bindings);
      res.send(body.results.bindings);
    });
});

app.get('/obtenerEspecializaciones', (req, res) => {
  var consulta = 'select ?nombre ?id where {'
  + ' ?e a ex:Especializacion. ?e ex:especializacion_tiene_nombre ?nombre. ?e ex:especializacion_tiene_ID ?id.}'

  query.execute(conn, db, consulta, 'application/sparql-results+json', {
      limit: 10,
      offset: 0,
  }).then(({ body }) => {
    console.log(body.results.bindings);
    res.send(body.results.bindings);
  });
});

app.get('/obtenerCostoEspecializacion/:id', (req, res) => {
  var id = req.params.id;
  var consulta = 'select ?costo where {'
  + '?e a ex:Especializacion.?e ex:especializacion_tiene_costo ?costo.?e ex:especializacion_tiene_ID ?id.'
	+ 'FILTER (?id="'+ id +'").}'

  query.execute(conn, db, consulta, 'application/sparql-results+json', {
      limit: 10,
      offset: 0,
  }).then(({ body }) => {
    console.log(body.results.bindings);
    res.send(body.results.bindings);
  });
});

app.get('/obtenerCursosEspecializacion/:id', (req, res) => {
  var id = req.params.id;

  var consulta = 'SELECT ?nombre ?orden WHERE {'
	+ '?e a ex:Especializacion. ?e ex:especializacion_tiene_ID ?id. FILTER (?id ="'+ id +'").'
  + '?e ex:tiene_planificacionEspecialización ?p. ?p ex:tiene_ordenCurso ?o.'
  + '?o ex:tiene_curso ?c. ?o ex:tiene_nroOrden ?orden. ?c ex:curso_tiene_nombre ?nombre.}'
  + 'ORDER BY ?orden';

  query.execute(conn, db, consulta, 'application/sparql-results+json', {
      limit: 10,
      offset: 0,
  }).then(({ body }) => {
    console.log(body.results.bindings);
    res.send(body.results.bindings);
  });
});

app.get('/obtenerCursosAlumno/:nombre_alumno', (req, res) => {
  var nombre_alumno = req.params.nombre_alumno;

  var consulta = 'select ?nombre_curso ?id where {'
  + '?a a ex:Alumno. ?a ex:alumno_tiene_nombre ?nombre_alumno.'
  + 'filter (?nombre_alumno="' + nombre_alumno + '").'
  + '?c a ex:Curso. ?c ex:curso_tiene_nombre ?nombre_curso.'
  + '?c ex:curso_tiene_ID ?id. ?a ex:inscripto_en ?com. ?com ex:pertenece_a ?c.}'

  query.execute(conn, db, consulta, 'application/sparql-results+json', {
      limit: 10,
      offset: 0,
  }).then(({ body }) => {
    console.log(body.results.bindings);
    res.send(body.results.bindings);
  });
});

app.get('/obtenerCertificadosCursado/:nombre_alumno', (req, res) => {
  var nombre_alumno = req.params.nombre_alumno;

  var consulta = 'select ?id where {'
  + '?a a ex:Alumno. ?a ex:alumno_tiene_nombre ?nombre_alumno.'
  + 'filter (?nombre_alumno="' + nombre_alumno + '").'
  + '?c a ex:Curso. ?c ex:curso_tiene_ID ?id.'
  + '?cc a ex:CertificadoDeCursado.?cc ex:certificadoDeCursado_de_alumno ?a.?cc ex:certificadoDeCursado_de_curso ?c.}'

  query.execute(conn, db, consulta, 'application/sparql-results+json', {
      limit: 10,
      offset: 0,
  }).then(({ body }) => {
    console.log(body.results.bindings);
    res.send(body.results.bindings);
  });
});

app.get('/obtenerCertificadosAprobado/:nombre_alumno', (req, res) => {
  var nombre_alumno = req.params.nombre_alumno;

  var consulta = 'select ?id where {'
  + '?a a ex:Alumno. ?a ex:alumno_tiene_nombre ?nombre_alumno.'
  + 'filter (?nombre_alumno="' + nombre_alumno + '").'
  + '?c a ex:Curso. ?c ex:curso_tiene_ID ?id.'
  + '?cc a ex:CertificadoDeAprobado.?cc ex:certificadoDeAprobado_de_alumno ?a.?cc ex:certificadoDeAprobado_de_curso ?c.}'

  query.execute(conn, db, consulta, 'application/sparql-results+json', {
      limit: 10,
      offset: 0,
  }).then(({ body }) => {
    console.log(body.results.bindings);
    res.send(body.results.bindings);
  });
});

app.listen(3000, () => {
    console.log("Conectado");
});
