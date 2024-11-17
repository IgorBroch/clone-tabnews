function status(request, response) {
  response
    .status(200)
    .json({ client: "Alunos do curso.dev são acima de média" });
}

export default status;
