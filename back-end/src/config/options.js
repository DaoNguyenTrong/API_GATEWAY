const selections = {
  phase: [
    { value: 0, label: 'Feasibility before' },
    { value: 1, label: 'Feasibility study' },
    { value: 2, label: 'Technical design' },
    { value: 3, label: 'Construction drawings' },
    { value: 4, label: 'As-built drawing' },
  ],
  spillwayShape: [
    { value: 'practical', label: 'Practical section' },
    { value: 'trapezoid', label: 'Trapezoid section' },
    { value: 'pianoKey', label: 'Piano key section' },
  ],
};

const suggestions = {
  documentTypes: ['Thông tư', 'Nghị định'],
  regulatoryIssuer: ['BTNMT', 'Chính phủ'],
  source: ['Internet'],
  projectReportName: [
    'Báo cáo tóm tắt',
    'Báo cáo chính',
    'Thuyết minh thiết kế cơ sở',
    'Điều kiện khí tượng thủy văn',
    'Điều kiện địa hình công trình',
    'Điều kiện địa chất công trình',
    'Thủy năng, kinh tế năng lượng',
    'Phân tích kinh tế tài chính',
    'Tổng mức đầu tư',
    'Phụ lục tính toán',
    'Quy trình vận hành hồ chứa',
    'Đánh giá tác động môi trường',
    'Báo cáo khảo sát hiện trường',
    'Số liệu mưa quan trắc lưu vực',
    'Ghi chép vận hành nhà máy',
  ],
  projectReportType: [],
  phase: ['Tiền khả thi', 'Nghiên cứu khả thi', 'Thiết kế kỹ thuật'],
  rainStationDataType: ['Mưa ngày', 'Mưa giờ'],
  periods: ['5 minutes', '10 minutes', '30 minutes', '1 hour'],
  dischargeTypes: ['Free overflow cavity', 'Valve gate with control', 'Controlled valve gate and free overflow chamber'],
  damTypes: ['Gravity Concrete', 'Dry rubble dam', 'Ground dam', 'Complex'],

  position: ['Right side', 'Left side', 'Center'],
  gateTypes: ['Radial gate', 'Plane gate'],
  liftTypes: ['Winch', 'Hydraulic Cylinders'],
  gateLiftingDirections: ['Straight', 'Circular arc'],
  gateMotorSupply: ['Grid', 'Grid and backup'],
  structure: ['Construct', 'Hydraulic mechanics', 'Hydro technics'],
  waterwayTypes: ['Open canals', 'Pressure tunnel', 'Tunnel without pressure'],
  waterwayConductTypes: ['Through terrain', 'Through the dam body'],
  waterwayConductMethods: ['Private canals', 'Common canals'],
  waterwayCanalSectionTypes: ['Round', 'Dome', 'Horseshoe', 'Trapezoid'],
  surgeTankTypes: [],
  powerhouseType: ['Powerhouse after dam', 'Powerhouse far from dam'],
};

module.exports = { selections, suggestions };
