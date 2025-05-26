
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-10 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="font-bold text-2xl mb-6 flex items-center">
              <span className="font-bold text-blue-600">UDF</span>
              <span className="text-blue-400">Editör</span>
            </div>
            <p className="text-gray-600 mb-4">
              UDF belgelerinizi düzenlemek, imzalamak ve yönetmek için en iyi çözüm.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">Hızlı Linkler</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Anasayfa</a></li>
              <li><a href="/editor" className="text-gray-600 hover:text-blue-600 transition-colors">UDF Düzenleyici</a></li>
              <li><a href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Fiyatlandırma</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">Hakkımızda</a></li>
              <li><a href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Giriş Yap</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">Yasal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">KVKK</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Kullanım Şartları</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Teslimat ve İade</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Çerez Politikası</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@udfeditor.com
              </li>
              <li className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +90 (555) 123 45 67
              </li>
              <li className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Maslak, İstanbul, Türkiye
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} UDF Editör. Tüm hakları saklıdır.
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
              <span className="text-sm text-gray-500 md:mr-4">Ödeme Yöntemleri:</span>
              <div className="flex space-x-3">
                <div className="h-8 w-12 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center">
                  <svg className="h-5 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 11H4V37H44V11Z" fill="#E6E6E6" />
                    <path d="M15 29L17.5 19H21L18.5 29H15Z" fill="#3C58BF" />
                    <path d="M29 19C28 19 26.2 19.2 25.6 21C25.6 21 25.4 21.7 27.8 21.7C28.5 21.7 29.2 21.4 29.2 21.4L29.7 19.1C29.7 19.1 29.3 19 29 19Z" fill="#293688" />
                    <path d="M33 19L29.7 29H26.5L29.8 19H33Z" fill="#3C58BF" />
                    <path d="M22.5 24.5C22.5 22.8 24.4 21.7 27.1 21.7C27.8 21.7 29.2 21.9 29.2 21.9L29.7 19.1C29.7 19.1 28.4 19 27.7 19C24.1 19 19.5 21.1 19.5 24.8C19.5 29.8 26.8 29 26.8 26.5C26.8 24.5 22.5 24.5 22.5 24.5Z" fill="#3C58BF" />
                    <path d="M42 19H39L35.5 29H38.5L39 27.7H42.8L43 29H46L42 19ZM39.7 25.5L41 21.5L42 25.5H39.7Z" fill="#3C58BF" />
                  </svg>
                </div>
                <div className="h-8 w-12 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center">
                  <svg className="h-5 w-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 11H4V37H44V11Z" fill="#E6E6E6" />
                    <path d="M27 24C27 20.7 29.7 18 33 18C36.3 18 39 20.7 39 24C39 27.3 36.3 30 33 30C29.7 30 27 27.3 27 24Z" fill="#D9222A" />
                    <path d="M9 24C9 20.7 11.7 18 15 18C18.3 18 21 20.7 21 24C21 27.3 18.3 30 15 30C11.7 30 9 27.3 9 24Z" fill="#EE9F2D" />
                    <path d="M21 18H27V30H21V18Z" fill="#423E3F" />
                  </svg>
                </div>
                <div className="h-8 w-12 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">EFT</span>
                </div>
                <div className="h-8 w-12 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center">
                  <svg className="h-5 w-8" viewBox="0 0 70 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M56.7 4.7C55.7 4.7 54.9 5.5 54.9 6.5C54.9 7.5 55.7 8.3 56.7 8.3C57.7 8.3 58.5 7.5 58.5 6.5C58.4 5.5 57.7 4.7 56.7 4.7Z" fill="#FF6B01" />
                    <path d="M14.5 7.3H9.4V15.1H14.5C17 15.1 18.8 13.3 18.8 11.2C18.8 9.1 17 7.3 14.5 7.3Z" fill="#FF6B01" />
                    <path d="M66.3 0.5H3.7C1.9 0.5 0.5 1.9 0.5 3.6V18.3C0.5 20 1.9 21.4 3.7 21.4H66.3C68.1 21.4 69.5 20 69.5 18.3V3.6C69.5 1.9 68.1 0.5 66.3 0.5Z" stroke="#FF6B01" />
                    <path d="M44.9 8.9L42.7 13H41.4L39.2 8.9V15.1H36.1V7.3H40.5L41.9 10.1L43.4 7.3H47.8V15.1H44.8V8.9H44.9Z" fill="#253B80" />
                    <path d="M27.5 7.3L24.3 15.1H21.1L18 7.3H21.5L23.2 12.1L24.9 7.3H27.5Z" fill="#253B80" />
                    <path d="M33.7 13.4C33.7 13.4 32.5 15.3 29.8 15.3C27.7 15.3 26.1 13.6 26.1 11.2C26.1 8.8 27.7 7.1 29.8 7.1C32.2 7.1 33.3 8.7 33.3 8.7L31.1 9.9C31.1 9.9 30.5 8.9 29.6 8.9C28.7 8.9 28.5 9.9 28.5 11.2C28.5 12.5 28.8 13.5 29.7 13.5C30.7 13.5 31.3 12.5 31.3 12.5L33.7 13.4Z" fill="#253B80" />
                    <path d="M51.1 15.1V7.3H54.2V13.3H57.3V15.1H51.1Z" fill="#253B80" />
                    <path d="M58.6 15.1V7.3H61.7V15.1H58.6Z" fill="#253B80" />
                    <path d="M48.2 15.1V7.3H51.3V15.1H48.2Z" fill="#253B80" />
                    <path d="M14.4 9C15.2 9 15.9 9.7 15.9 10.5C15.9 11.3 15.2 12 14.4 12H9.4V9H14.4Z" fill="#253B80" />
                  </svg>
                </div>
                <div className="h-8 w-12 bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center">
                  <svg className="h-5 w-8" viewBox="0 0 74 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M55.4 0.8H18.7C8.9 0.8 0.9 8.8 0.9 18.6C0.9 19.6 1 20.6 1.2 21.5H72.9C73.1 20.6 73.2 19.6 73.2 18.6C73.1 8.8 65.2 0.8 55.4 0.8Z" fill="#8CC63F" />
                    <path d="M71 7.8C70.1 6.1 68.9 4.7 67.6 3.4L46.3 21.5H56.2C57.1 21.5 58 21.4 58.9 21.2C61.4 20.6 63.6 19.3 65.4 17.5C67.5 15.5 68.9 12.8 69.4 9.8C69.9 9.3 70.3 8.7 70.7 8.2C70.9 8 70.9 7.9 71 7.8Z" fill="#25A9E0" />
                    <path d="M11.6 21.5L32.9 3.4C31.6 2.6 30.1 2 28.6 1.6C25.9 0.9 23 1 20.3 1.6C13.8 3.2 8.6 8.2 7 14.6C6.2 17.8 6.6 21.1 8 23.9C9.1 23.2 10.3 22.4 11.6 21.5Z" fill="#25A9E0" />
                    <path d="M43.4 23.9C45.1 21.9 46.9 19.7 48.4 17.7C50.5 15 49.7 11.5 46.7 9.8C45.2 9 43.2 8.9 41.5 9.5C40.2 9.9 39.2 10.7 38.5 11.9C37.4 13.6 37.7 15.5 39.2 16.9C39.9 17.6 40.8 18 41.8 18.2C42.8 18.4 43.9 18.3 44.9 18C45.6 17.8 46.2 17.5 46.8 17.1C46.6 17.5 46.3 17.8 46 18.1C44.8 19.4 43.4 20.5 41.8 21.3C40.1 22.1 38.2 22.6 36.3 22.8C35.1 22.9 33.9 22.9 32.7 22.7C31.2 22.4 29.8 21.9 28.5 21.1C29.2 22 30 22.7 30.9 23.3C33.5 25 36.6 25.7 39.7 25.2C41.1 24.9 42.3 24.5 43.4 23.9Z" fill="white" />
                    <path d="M38.7 17.2C37 17.2 36.7 15.9 36.7 15.9C36.6 15.3 36.9 14.7 37.5 14.4C37.9 14.2 38.3 14.1 38.8 14.1C40.5 14.1 40.9 15.4 40.9 15.4C40.9 16 40.7 16.5 40.1 16.8C39.7 17.1 39.2 17.2 38.7 17.2Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
