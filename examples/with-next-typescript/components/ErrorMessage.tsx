type PropTypes = {
  message: string
}

const ErrorMessage: React.SFC<PropTypes> = ({ message }) => (
  <aside>
    {message}
    <style jsx>{`
      aside {
        padding: 1.5em;
        font-size: 14px;
        color: white;
        background-color: red;
      }
    `}</style>
  </aside>
)

export default ErrorMessage;