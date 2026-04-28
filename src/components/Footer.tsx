import { uiLabels } from '../constants/labels';

export default function Footer() {
    const { footer } = uiLabels;

    return (
        <footer className="bg-gray-900 text-gray-500 text-xl text-center p-3 border-t border-gray-800">
            <p>{footer.copyright}</p>
            <a
                href="https://github.com/WolandEmort"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 hover:underline transition-colors mt-1"
            >
                {footer.githubLink}
            </a>
        </footer>
    );
}