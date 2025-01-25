import Error from "./error";

function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <Error />
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  );
}

export default Header;
