function status(req, res) {
  return res.status(200).json({
    message: "API v1 is working",
  });
}

export default status;
