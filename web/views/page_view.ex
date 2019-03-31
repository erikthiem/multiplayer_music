defmodule Chat.PageView do
  use Chat.Web, :view

  def roomid do
    :rand.uniform(10000)
  end

  def dotid do
    :rand.uniform(10000)
  end
end
