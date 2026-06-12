import { Phone, User, Award } from 'lucide-react';

const salesRep = {
  name: 'Nguyễn Minh Trang',
  experience: 'Kinh nghiệm hơn 10 năm trong lĩnh vực năng lượng mặt trởi',
  phone: '0917 599 966',
  avatar: 'N',
  color: 'from-orange-500 to-amber-500',
};

export default function ContactConsultation() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-10">
          <p className="text-gray-500 text-sm mb-2">
            Thông tin liên hệ sale để được hỗ trợ chuyên sâu:
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Liên hệ tư vấn:</h2>
        </div>

        {/* Sales rep card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${salesRep.color} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                {salesRep.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-orange-500" />
                  <h3 className="font-bold text-gray-900">{salesRep.name}</h3>
                </div>
                <div className="flex items-start gap-1.5 mb-4">
                  <Award className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-500 leading-relaxed">{salesRep.experience}</p>
                </div>

                {/* Contact button */}
                <a
                  href={`tel:${salesRep.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {salesRep.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
