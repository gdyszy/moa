// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "title": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "题目"
  },
  "option_type": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "单选题",
            "value": 0
          },
          {
            "text": "多选题",
            "value": 1
          },
          {
            "text": "文本题",
            "value": 2
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "类型"
  },
  "survey_id": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "关闭",
            "value": 0
          },
          {
            "text": "开启",
            "value": 1
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "状态"
  },
  "weigh": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "defaultValue": 0,
    "label": "权重"
  }
}

const enumConverter = {
  "option_type_valuetotext": {
    "0": "单选题",
    "1": "多选题",
    "2": "文本题"
  },
  "status_valuetotext": {
    "0": "关闭",
    "1": "开启"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
