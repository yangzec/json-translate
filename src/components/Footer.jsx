export default function Footer() {
  return (
    <footer className="py-8 text-gray-600">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-6">
        <div className="text-sm w-full text-center md:w-auto">
          Created with ❤️ by Viggo
        </div>
        <div className="flex items-center gap-6">
          <a 
            href="https://x.com/decohack" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-900 transition-colors"
          >
            <TwitterIcon /> @viggo
          </a>
          <a 
            href="https://buymeacoffee.com/viggoz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-900 transition-colors"
          >
            <CoffeeIcon /> Buy Me a Coffee
          </a>
        </div>
      </div>
    </footer>
  )
}

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40.859 12.9375H46.648L34.0007 27.3925L48.8792 47.0625H37.2277L28.1032 35.1327L17.6627 47.0625H11.8702L25.3977 31.6012L11.1265 12.9375H23.0702L31.318 23.8417L40.859 12.9375ZM38.8272 43.5975H42.035L21.329 16.2205H17.8867L38.8272 43.5975Z" fill="currentColor"/>
  </svg>
)

const CoffeeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M19.4998 9C19.2003 9.00007 18.9076 9.08983 18.6595 9.25772C18.4114 9.42561 18.2193 9.66394 18.1078 9.942L15.5878 16.242H44.4118L41.8918 9.942C41.7804 9.66394 41.5883 9.42561 41.3402 9.25772C41.0921 9.08983 40.7994 9.00007 40.4998 9H19.4998ZM18.0178 49.728L15.7558 35.034H44.2438L41.9818 49.728C41.9274 50.0821 41.748 50.4049 41.4762 50.6382C41.2044 50.8715 40.8581 50.9999 40.4998 51H19.4998C19.1416 50.9999 18.7953 50.8715 18.5235 50.6382C18.2516 50.4049 18.0723 50.0821 18.0178 49.728ZM15.3478 19.989H44.6548C46.4548 19.989 47.9098 21.255 47.9098 22.815V28.461C47.9098 30.021 46.4518 31.281 44.6548 31.281H15.3448C13.5448 31.281 12.0898 30.021 12.0898 28.461V22.815C12.0898 21.255 13.5508 19.989 15.3478 19.989Z" fill="currentColor"/>
  </svg>
) 