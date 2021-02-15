import React from 'react'

export default class Test extends React.Component {
    state = {
      filter: "",
      data: [
        {
          fname: "Jayne",
          lname: "Washington",
          email: "jaynewashington@exposa.com",
          gender: "female"
        },
        {
          fname: "Peterson",
          lname: "Dalton",
          email: "petersondalton@exposa.com",
          gender: "male"
        },
        {
          fname: "Velazquez",
          lname: "Calderon",
          email: "velazquezcalderon@exposa.com",
          gender: "male"
        },
        {
          fname: "Norman",
          lname: "Reed",
          email: "normanreed@exposa.com",
          gender: "male"
        }
      ]
    };
  
    handleChange = event => {
      this.setState({ filter: event.target.value });
    };
  
    render() {
      const { filter, data } = this.state;
      const lowercasedFilter = filter.toLowerCase();
      const filteredData = data.filter(item => {
        return Object.keys(item).some(key =>
          item[key].toLowerCase().includes(lowercasedFilter)
        );
      });
  
      return (
        <div>
          <input value={filter} onChange={this.handleChange} />
          {filteredData.map(item => (
            <div key={item.email}>
              <div>
                {item.fname} {item.lname} - {item.gender} - {item.email}
              </div>
            </div>
          ))}
        </div>
      );
    }
  }