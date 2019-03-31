defmodule Chat.PageController do
  use Chat.Web, :controller

  def new(conn, params) do
    render conn, "welcome.html"
  end

  def index(conn, params) do
    render conn, "index.html"
  end

  def show(conn, params) do
    render conn, "show.html"
  end
end
