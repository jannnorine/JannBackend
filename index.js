const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))


// get
app.get("/", (req, res) => {
    res.send("Added!")

})

// ------------------------ADD--------------------------
//Add Employee
//post siya kay mag add ta  (pg admin INSERT)
app.post("/AddEmp", async (req, res) => {
    try {
        const { firstname, lastname, contactnum, emailadd, birthday, msalary, department } = req.body
        const sql = `INSERT INTO public."Employee"(firstname, lastname, contactnum, emailadd, birthday, msalary, department)
   VALUES ( $1, $2, $3, $4, $5, $6, $7) returning *`  //baktik
        const rs = await pool.query(sql, [firstname, lastname, contactnum, emailadd, birthday, msalary, department]) //tawag db

        res.json(rs.rows)
    } catch (error) {
        res.json(error.message)

    }
})

//Add Dept
//POST siya kay mag add ta
app.post("/AddDept", async (req, res) => {
    try {
        const { deptname } = req.body
        const sql = `INSERT INTO public."Department"(deptname)
            VALUES ($1) returning *`  //baktik
        const rs = await pool.query(sql, [deptname]) //tawag db

        res.json(rs.rows)
    } catch (error) {
        res.json(error.message)

    }
}
)




// -----------------------------GET---------------------------
//FETCH Employee SELECT
//GET siya kay fetch add ta
app.get("/GetEmp", async (req, res) => {
    try {
        const sql = `SELECT e.id, firstname, lastname, emailadd, birthday, msalary, d.deptname , contactnum
        FROM public."Employee" e
        LEFT OUTER JOIN "Department" d On d.id = e.department`  //baktik
        const rs = await pool.query(sql) //tawag db

        res.json(rs.rows)
    } catch (error) {
        res.json(error.message)
    }
})

//FETCH Department SELECT
//GET siya kay mag fetch ta
app.get("/GetDept", async (req, res) => {
    try {
        const sql = `SELECT id, deptname FROM public."Department"`  //baktik
        const rs = await pool.query(sql) //tawag db

        res.json(rs.rows)
    } catch (error) {
        res.json(error.message)
    }
})

//FETCH Bonus SELECT
//GET siya kay mag fetch ta
app.get("/GetBonus", async (req, res) => {
    try {
        const sql = 'SELECT id, value, month, department FROM public."Bonus"'  //baktik
        const rs = await pool.query(sql) //tawag db

        res.json(rs.rows)
    } catch (error) {
        res.json(error.message)
    }
})

// FETCH Reports SELECT
app.get("/GetReports/:dept/:month", async (req, res) => {
    try {
        const sql = `SELECT e.id, firstname, lastname, emailadd, birthday, msalary, d.deptname , contactnum, (msalary+(msalary*b.value)) as salary_with_bonus, b.month

        FROM public."Employee" e
        LEFT OUTER JOIN "Department" d On d.id = e.department
        LEFT OUTER JOIN "Bonus" b On b.department = d.id
        WHERE  e.department = $1 and b.month = $2`
        
        //baktik
        const rs = await pool.query(sql,[req.params.dept, req.params.month])//tawag db

        res.json(rs.rows)
    } catch (error) {
        res.json(error.message)
    }
})


 
// -----------------------------UPDATE--------------------------- 
//Update Employee
//PUT siya kay mag Update ta
app.put("/UpdtEmp/:id", async (req, res) => {
    try {
        const { firstname, lastname, contactnum, emailadd, birthday, msalary, department } = req.body
        const sql = `UPDATE public."Employee"
        SET  firstname=$2, lastname=$3, emailadd=$4, birthday=$5, msalary=$6, department=$7, contactnum=$8
        WHERE id= $1`  //baktik
        const rs = await pool.query(sql, [req.params.id, firstname, lastname, contactnum, emailadd, birthday, msalary, department]) //tawag db

        res.json(rs.rows)
    } catch (error) {
        res.json(error.message)
    }
})


// -----------------------------DELETE--------------------------- 
//Delete Employee
//Delete siya kay mag Delete ta
app.delete("/DelEmp/:ideeeee", async (req, res) => {
    try {
        const sql = `DELETE FROM public."Employee" 
        WHERE id=$1`  //baktik
        const rs = await pool.query(sql, [req.params.ideeeee]) //tawag db

        res.json(rs.rows)
    } catch (error) {
        res.json(error.message)
    }
})




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serverat:port${PORT}`)
})

