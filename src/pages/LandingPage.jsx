import { Link } from 'react-router-dom'
import logo from '../../icon.svg'
import click from '../../tap.svg'
import update from '../../update.svg'
import globe from '../../anywhere.svg'

const STORE_URL = '#' // Replace with your Chrome Web Store URL

const features = [
  {
    icon: (
      <img src={click} className="w-10 h-10" />
    ),
    title: 'Save In One Click',
    desc: 'Hit the extension on any job listing and it\'s instantly saved.',
  },
  {
    icon: (
      <img src={update} className="w-10 h-10" />
    ),
    title: 'Stay Updated',
    desc: 'Move applications through Applied, Interviewing, Ghosted, Rejected, or Accepted with a single dropdown.',
  },
  {
    icon: (
      <img src={globe} className="w-10 h-10" />
    ),
    title: 'Access Anywhere',
    desc: 'Log in from any device and your full application history is right there.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="MyJobsLab" className="w-8 h-8" />
            <span className="font-bold text-lg tracking-tight text-gray-900">MyJobsLab</span>
          </div>

          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold text-sm px-4 py-1.5 rounded-lg transition-colors duration-150"
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-24 pb-48 text-center px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Track Jobs. Stay Organized.<br className="hidden sm:block" />Get Hired.
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Use MyJobsLab to manage your job search, keep track of every application, and never miss an opportunity.
          </p>
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block bg-blue-600 hover:brightness-110 text-white font-bold text-lg px-10 py-4 rounded-md transition-all duration-150 shadow-lg shadow-blue-500/25"
          >
            Get MyJobsLab Now
          </a>
          <p className="mt-3 text-sm text-gray-400">Free Chrome Extension · No credit card required</p>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-[52rem] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-lg px-7 pt-7 pb-24 border border-gray-100 shadow-xl shadow-[0_0_20px_rgba(0,0,0,0.24)] -mt-40">
                <div className="flex items-center justify-center mb-3 mx-auto">
                  {f.icon}
                </div>
                <h3 className="font-bold text-blue-600 text-xl text-center mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-600 font-bold text-xl uppercase tracking-widest">About MyJobsLab</p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
              Built for the modern job search
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              We built MyJobsLab because job searching is already stressful enough without having to manage a messy spreadsheet of every position you've applied to. Keeping track of where you applied, what stage you're at, and which companies have gone quiet is a job in itself, so we made a tool that handles it for you.
            </p>
            <p className="text-gray-500 leading-relaxed mb-4">
              MyJobsLab is a free browser extension paired with a personal dashboard that lets you save any job listing in one click and track it from application to offer. Whether you're actively applying to dozens of roles or casually exploring opportunities, your entire job search lives in one organized place accessible from any device.
            </p>
            <p className="text-gray-500 leading-relaxed">
              We believe the job search process should feel manageable, not overwhelming. Our goal is simple, to give job seekers a clear, distraction-free way to stay on top of their applications so they can focus on what actually matters: preparing, connecting, and landing the role they want.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 flex flex-col gap-4">
            {["Applied · Software Engineer @ Google", "Interviewing · Frontend Dev @ Stripe", "Ghosted · Full Stack @ Meta"].map((job, i) => (
              <div key={i} className="bg-white rounded-xl px-5 py-4 shadow-[0_0_20px_rgba(0,0,0,0.06)] flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">{job.split("·")[1]}</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${i === 0 ? "bg-blue-100 text-blue-600" :
                  i === 1 ? "bg-yellow-100 text-yellow-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                  {job.split("·")[0].trim()}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Second CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
            Ready to stay organized?
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-md mx-auto">
            Install the extension in seconds and start tracking your first application today.
          </p>
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block bg-blue-600 hover:brightness-110 text-white font-bold text-lg px-10 py-4 rounded-md transition-all duration-150 shadow-lg shadow-blue-500/25"
          >
            Get MyJobsLab Now
          </a>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-white font-semibold text-sm">MyJobsLab</span>
          <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">
            Log In
          </Link>
        </div>
      </footer>

    </div>
  )
}
