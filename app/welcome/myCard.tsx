interface LinkSocial {
  href: string;
  text: string;
  icon: React.ReactNode;
}

const MyCard = ({ linkSocials, title = "Tôi là react" }: { linkSocials: LinkSocial[]; title: string | number }) => {

  return (
    <div className="max-w-[300px] w-full space-y-6 px-4">
      <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
        <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
          {title}
        </p>
        <ul>
          {linkSocials.map(({ href, text, icon }) => (
            <li key={href}>
              <a
                className="group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {icon}
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MyCard;
