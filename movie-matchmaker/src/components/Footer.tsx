const developers = [
  {
    name: "Lalit Rawool",
    role: "Backend Developer",
  },
  {
    name: "Krushna Wale",
    role: "Frontend Developer",
  },
  {
    name: "Poojan Pandit",
    role: "API Developer",
  },
  {
    name: "Prachi Adhau",
    role: "Database Developer",
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border mt-auto bg-background">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <h3 className="font-display text-3xl text-primary tracking-wider mb-3">
            CINEFLOW
          </h3>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your gateway to cinematic excellence. Discover, watch, and enjoy
            personalized movie recommendations with CineFlow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {developers.map((developer, index) => (
            <div
              key={index}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {developer.name.charAt(0)}
              </div>

              <h4 className="text-lg font-semibold text-card-foreground mb-2">
                {developer.name}
              </h4>

              <p className="text-sm text-muted-foreground mb-4">
                {developer.role}
              </p>

              <div className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                Team CineFlow
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 CineFlow. Developed by Lalit Rawool, Krushna Wale, Poojan Pandit, and Prachi Adhau.
      </div>
    </footer>
  );
};

export default Footer;